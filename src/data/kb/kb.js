import arch from "../../assets/images/arch.png";

const kb = [
  {
    content: [
      "프로젝트를 진행하던 중",
      "엑셀 파일을 이용하여 조직 구조 업데이트 기능 구현한 적이 있었다.",
      "사용자 요청이 트리거가 되기 때문에, Spring Web과 Spring Batch를 이용하여",
      "Request가 들어오면 동적으로 Job을 생성해 실행하였는데,",
      "자주 실행되지 않는 Batch기능을 Web Api와 같이 서버에 올라가는게 마음에 들지 않았었다.",
      "그래서 AWS Lambda를 이용하여, 조직 구조 업데이트 기능을 다시 구현해보았다.",
    ],
  },
  {
    image: arch,
    content: [
      "1. 영업관리자(SLM) Front에서 Backend로 엑셀 업로드",
      "2. 엑셀 파일을 S3에 PUT",
      "3. S3 트리거로 lambda 실행",
      "4. Lambda에서 고객 데이터 플랫폼(CDP)으로 데이터 송신",
      "5. CDP RDB 업데이트 및 MongoDB 업데이트",
      "6. MongoDB에서 최신 정보 Select ",
    ],
  },
  {
    code: `
      @Service
      @RequiredArgsConstructor
      public class OrgMappingService {
      
        private final OrgDocumentRepository repository;
      
        private final AmazonS3Client amazonS3Client;
      
        @Value("\${cloud.aws.s3.bucket}")
        public String bucket;
      
        public Flux<DataBuffer> mapping(String fileName, Flux<DataBuffer> flux) {
          return flux.doOnNext(d -> {
            ObjectMetadata objectMetaData = new ObjectMetadata();
            objectMetaData.setContentType("xlsx");
            objectMetaData.setContentLength(d.readableByteCount());
      
            try(InputStream inputStream = d.asInputStream()) {
              amazonS3Client.putObject(new PutObjectRequest(bucket, fileName, inputStream, objectMetaData)
                              .withCannedAcl(CannedAccessControlList.PublicRead));
                  } catch(IOException e) {
                      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "파일 업로드에 실패했습니다.");
                  }
          });
      
        }
      
        public Flux<OrgDocument> findAll(Pageable pageable) {
          return repository.findAll(pageable.getSort()).skip(pageable.getOffset()).take(pageable.getPageSize());
        }
      
      }
    `,
    content: [
      "영업관리자(SLM)은 프론트와 백엔드로 나뉘어 있으며,",
      "백엔드는 프론트에 종속적입니다.",
      "조직 구조 리스트를 조회할 때는 MongoDB에서 Select하고,",
      "업데이트를 위해 엑셀 파일을 업로드 하면,",
      " S3로 파일을 PUT합니다.",
    ],
  },
  {
    code: `
    @Component
    @RequiredArgsConstructor
    public class BatchFunction implements Function<S3Event, ResponseEntity<BatchStatus>> {
    
      private final AmazonS3Client amazonS3Client;
    
      private final BatchService batchService;
    
      @Override
      public ResponseEntity<BatchStatus> apply(S3Event input) {
        S3EventNotificationRecord record = input.getRecords().get(0);
        String s3Key = URLDecoder.decode(record.getS3().getObject().getKey(), StandardCharsets.UTF_8);
        String s3Bucket = record.getS3().getBucket().getName();
        
        S3Object object = amazonS3Client.getObject(new GetObjectRequest(s3Bucket, s3Key));
        return new ResponseEntity<BatchStatus>(batchService.batch(object), HttpStatus.OK);
      }
    
    }
    `,
    content: [
      "S3 PUT Objecct가 발생하면,",
      "Lambda에서 해당 Function이 실행되며, ",
      "S3Event 객체 정보를 이용하여 Object를 GET합니다. ",
      "해당 Object를 이용하여 Batch Service 실행",
    ],
  },
  {
    code: `
      private final ExcelService excelService;

      private final StepBuilderFactory stepBuilderFactory;

      //.....

      private final RSocketRequester rSocketRequester;

      public BatchStatus batch(S3Object object) {

        List<Map<String, Object>> list = excelService.read(object.getObjectContent());

        Step step = stepBuilderFactory.get("step").listener(new StepExecutionListener() {

          @Override
          public void beforeStep(StepExecution stepExecution) {
            Boolean result = rSocketRequester.route("before").retrieveMono(Boolean.class).block();
            if (result) {
              return;
            } else {
              throw new IllegalStateException();
            }
          }

          @Override
          public ExitStatus afterStep(StepExecution stepExecution) {
            // TODO Auto-generated method stub
            return null;
          }
        })
        //..........
      }
    `,
    content: [
      "ExcelService를 이용하여 S3Object객체를 List객체로 변경한다.",
      "Step Listener 객체를 이용해 Step Execute전에",
      "DB 내용을 삭제한다.(true 응답이 와야 다음으로 진행)",
      "List객체를 Reader로 등록한다.",
    ],
  },
  {
    code: `

    //....
    private final StepBuilderFactory stepBuilderFactory;
  
    ..///
    private final RSocketRequester rSocketRequester;
  
    public BatchStatus batch(S3Object object) {
  
      //.......
      .<Map<String, Object>, OrgMappingDTO>chunk(100).reader(new ListItemReader<Map<String, Object>>(list))
      .processor(new ItemProcessor<Map<String, Object>, OrgMappingDTO>() {
        @Override
        public OrgMappingDTO process(Map<String, Object> item) throws Exception {
          OrgMappingDTO dto = new OrgMappingDTO();
          for (String key : item.keySet()) {
            MethodInvoker invoker = new MethodInvoker();
            for (Field field : dto.getClass().getDeclaredFields()) {
              if (!field.isSynthetic() && !field.getName().startsWith("$")
                  && key.equals(field.getDeclaredAnnotation(Excel.class).title())) {
                invoker.setTargetMethod(
                    "set" + String.valueOf(field.getName().charAt(0)).toUpperCase()
                        + field.getName().substring(1, field.getName().length()));
                invoker.setTargetObject(dto);
                invoker.setArguments(item.get(key));
                invoker.prepare();
                invoker.invoke();
              }
            }
          }
          return dto;
        }
      }).writer(new ItemWriter<OrgMappingDTO>() {
        @Override
        public void write(List<? extends OrgMappingDTO> items) throws Exception {
          Boolean result = rSocketRequester.route("orgMapping").data(items).retrieveMono(Boolean.class)
              .block();
          if (result) {
            return;
          } else {
            throw new IllegalStateException();
          }
        }
      }).build();
      //......
    `,
    content: [
      "Process에서 Map 객체를 DTO객체로 변경한다.",
      "변경된 객체는 Rsocket을 이용해 고객 데이터 플랫폼으로",
      "전송한다.(true 응답이 와야 다음으로 진행)",
    ],
  },
  {
    code: `

    //....
    private final StepBuilderFactory stepBuilderFactory;
  
    //...

    public BatchStatus batch(S3Object object) {
  
      //.......
      Job job = jobBuilderFactory.get("job").start(step).build();

      JobExecution execution = null;

      try {
        execution = launcher.run(job, new JobParameters());
      } catch (JobExecutionAlreadyRunningException | JobRestartException | JobInstanceAlreadyCompleteException
          | JobParametersInvalidException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
      }

      return execution.getStatus();
      //......
    `,
    content: ["Step을 Job에 등록하고, Job을 실행한다."],
  },
  {
    code: `
    @RestController
    @RequiredArgsConstructor
    public class OrganizationController {
    
      private final OrganizationService organizationService;
    
      @MessageMapping("before")
      public Mono<Boolean> deleteAll() {
        organizationService.deleteAll();
        return Mono.just(Boolean.TRUE);
      }
      
      @MessageMapping("orgMapping")
      public Mono<Boolean> addList(List<OrgMappingDTO> list) {
        organizationService.organize(list);
        return Mono.just(Boolean.TRUE);
      }
    
    }
    `,
    content: [
      "고객 통합 플랫폼(CDP)에서는 Request-Response 방식으로",
      " MessageMapping 되어있다.",
      '1. Step 시작전 "before" Message를 통해 ',
      "데이터 삭제를 수행하고 확인시 true를 반환한다.",
      "2. Chunk Size만큼 보내진 데이터를 RDB에 저장해",
      " 영속성을 보장하고, MongoDB에 저장한다. (true 반환)",
    ],
  },
];

export default kb;
