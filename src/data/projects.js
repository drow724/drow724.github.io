import kb from "../assets/images/KB_SymbolMark.png";
import sk from "../assets/images/img_ci_banner.jpeg";
import hana from "../assets/images/KEB-CIG_body_01.jpeg";
import deu from "../assets/images/deu.jpg";

const projects = [
  {
    title: "KB, Prudential 시스템 통합",
    list: [
      "프로젝트 초기부터 설계, 개발 참여",
      "영업관리자 시스템이라는 양사의 영업관리자, 설계매니저, 교육매니저의 실적 관리 시스템을 담당",
      "양사의 통합으로 인한 시스템 복잡성 해결",
      "Spring batch를 이용한 배치 시스템 개발 (조직 주소 좌표 변환, 인사 정보 최신화)",
    ],
    image: kb,
    detail: {
      text: "datail",
      link: "/kb",
    },
  },
  {
    title: "SK 전기차 충전 시스템",
    list: [
      "회원(개인 회원, 법인 회원) 관리 시스템 개발",
      "전기차 충전 카드 시스템 개발",
    ],
    image: sk,
  },
  {
    title: "하나은행 업무 포털",
    list: [
      "통합 업무 포털 Web Application 개발",
      "Spring Data JPA, queryDSL, Spring Batch를 이용한 시스템 개발(로그 최신화, 포탈 게시판 정보 최신화)",
    ],
    image: hana,
  },
  {
    title: "국립 통일교육원",
    list: [
      "Excel 작업으로 진행하던 통일위원 시스템 전산화 (Hibernate4 이용)",
      "회원가입 기능 개발(휴대폰 인증 API 연동)",
    ],
    image: deu,
    detail: {
      text: "link",
      link: "https://www.uniedu.go.kr",
    },
  },
];

export default projects;
