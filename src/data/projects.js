import kb from "../assets/images/KB_SymbolMark.png";
import sk from "../assets/images/img_ci_banner.jpeg";
import hana from "../assets/images/KEB-CIG_body_01.jpeg";
import deu from "../assets/images/deu.jpg";

const projects = [
  {
    title: "KB, Prudential 시스템 통합",
    list: ["영업관리자 시스템 백엔드 개발", "배치(batch) 시스템 개발"],
    image: kb,
    detail: {
      text: "datail",
      link: "/kb",
    },
  },
  {
    title: "SK 전기차 충전 시스템",
    list: ["법인 회원, 개인 회원 기능 개발", "회원 카드 시스템 구축"],
    image: sk,
  },
  {
    title: "하나은행 업무 포털",
    list: ["통합업무관리 개발", "배치(batch) 시스템 개발"],
    image: hana,
  },
  {
    title: "국립 통일교육원",
    list: ["통일위원 기능 개발", "회원 가입 기능 (휴대폰 인증 API)"],
    image: deu,
    detail: {
      text: "link",
      link: "https://www.uniedu.go.kr",
    },
  },
];

export default projects;
