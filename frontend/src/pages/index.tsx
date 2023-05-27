import { Button } from "@mui/joy";
import React from "react";
import { Link } from "react-router-dom";
import Layout from "./layout";

type IndexPageProps = {};

const IndexPage: React.FC<IndexPageProps> = ({}) => {
  const [isSmallerThanXL, setIsSmallerThanXL] = React.useState(
    window.innerWidth < 1280
  );

  React.useEffect(() => {
    window.addEventListener("resize", () => {
      setIsSmallerThanXL(window.innerWidth < 1280);
    });
    return () =>
      window.removeEventListener("resize", () => {
        setIsSmallerThanXL(window.innerWidth < 1280);
      });
  }, []);

  return (
    <Layout>
      <div className="xl:page-padding relative w-full bg-white xl:h-[800px] xl:py-64">
        <div className="relative right-0 top-0 h-[400px] w-full xl:absolute xl:h-full">
          <svg height="100%" width="100%">
            <mask id="mask" x="0" y="0" width="100%" height="100%">
              <ellipse cx="50%" cy="0%" rx="75%" ry="100%" fill="white" />
            </mask>
            <image
              fill="url(#grad1)"
              xlinkHref="hero.png"
              mask="url(#mask)"
              width={isSmallerThanXL ? "100%" : "80%"}
              x={isSmallerThanXL ? "0%" : "20%"}
              height="100%"
              preserveAspectRatio="xMidYMid slice"
            />
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="35%" stop-color="#fff" />
                <stop offset="60%" stop-color="rgba(255,255,255,0)" />
              </linearGradient>

              <linearGradient id="grad2" x1="90%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="rgba(255,255,255,0)" />
                <stop offset="100%" stop-color="rgba(255,255,255,0.75)" />
              </linearGradient>

              <linearGradient
                id="gradVertical"
                x1="0%"
                y1="60%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stop-color="rgba(255,255,255,0)" />
                <stop offset="100%" stop-color="rgba(255,255,255,0.75)" />
              </linearGradient>
            </defs>

            {isSmallerThanXL ? (
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="url(#gradVertical)"
                preserveAspectRatio="xMidYMid slice"
              />
            ) : (
              <>
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="url(#grad1)"
                  preserveAspectRatio="xMidYMid slice"
                />
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="url(#grad2)"
                  preserveAspectRatio="xMidYMid slice"
                />
              </>
            )}
          </svg>
        </div>
        <div className="page-padding mt-12 flex max-w-xl flex-col xl:mt-0 xl:max-w-md xl:px-0">
          <div className="z-10 mb-8 flex flex-col gap-2">
            <h1 className="text-7xl font-black leading-none">
              Kitaplatz,
              <br />
              Kinderleicht.
            </h1>
            <p className="text-xl font-medium">
              Schnell durch mehr als{" "}
              <strong className="font-bold">2000 Tageseinrichtungen</strong>{" "}
              stöbern und die perfekte Kita finden.
            </p>
          </div>
          <Link className="w-full" to="/finder">
            <Button
              variant="solid"
              size="lg"
              color="primary"
              href="/finder"
              fullWidth
              endDecorator={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#fff"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              }
            >
              Kitas finden
            </Button>
          </Link>
        </div>
      </div>
      <div className="page-padding flex w-full flex-col justify-between gap-40 bg-white py-40 2xl:flex-row">
        <div className="flex max-w-lg flex-col gap-6">
          <h3 className="text-3xl font-black">Was ist Kitaplatz Zentrale?</h3>
          <p className="text-xl font-medium">
            Kitaplatz Zentrale ist eine Plattform, die allen Eltern ermöglichen
            soll, schnell und einfach einen Kitaplatz für ihr Kind zu finden.
            Dazu werden alle Kitas in Deutschland in einer Datenbank gespeichert
            und können von Eltern durchsucht werden. Die Datenbank wird von den
            Kitas selbst gepflegt, sodass die Informationen immer aktuell sind.
          </p>
        </div>
        <div className="max-w-md flex-col 2xl:bg-happy-blue 2xl:bg-opacity-10 2xl:p-12">
          <h4 className="mb-6 text-3xl font-black 2xl:mb-2 2xl:text-xl">
            Kontakt
          </h4>
          <p className="mb-4 text-xl font-medium 2xl:text-base 2xl:font-normal">
            If you have any questions or would like to support our mission,
            please reach out to us.
          </p>
          <Button
            variant="plain"
            color="info"
            size="lg"
            href="mailto:hallo@kitaplatz-zentrale.de"
            startDecorator={
              <svg
                width="27"
                height="20"
                viewBox="0 0 27 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M23.2918 2.52523L3.48992 3.55795L12.6525 11.0812C13.1614 11.4991 13.902 11.4718 14.3788 11.0175L23.2918 2.52523ZM2.57806 4.69921L3.17342 16.115L7.43748 8.68924L2.57806 4.69921ZM4.0759 17.4767L24.5713 16.4078L18.9259 8.70259L15.3864 12.075C14.3754 13.0383 12.8048 13.0963 11.7255 12.2101L8.58215 9.62912L4.0759 17.4767ZM26.548 16.6343C26.6685 16.3558 26.7282 16.0459 26.7113 15.7223L26.0455 2.95555C25.987 1.83382 25.0302 0.971899 23.9085 1.0304L3.01747 2.11992C1.89574 2.17842 1.03382 3.13519 1.09232 4.25692L1.75814 17.0237C1.81664 18.1454 2.7734 19.0073 3.89514 18.9488L24.7862 17.8593C25.456 17.8244 26.0332 17.4691 26.3771 16.9497L26.6387 16.7581L26.548 16.6343ZM25.2003 14.7949L19.9923 7.68656L24.6006 3.29576L25.2003 14.7949Z"
                  fill="#318DB5"
                />
                <path
                  d="M23.2918 2.52523L23.4642 2.70623L23.9531 2.2404L23.2788 2.27557L23.2918 2.52523ZM3.48992 3.55795L3.4769 3.30829L2.83282 3.34188L3.33128 3.75116L3.48992 3.55795ZM12.6525 11.0812L12.4938 11.2744L12.6525 11.0812ZM14.3788 11.0175L14.2063 10.8365L14.3788 11.0175ZM2.57806 4.69921L2.73671 4.506L2.2989 4.14652L2.3284 4.71223L2.57806 4.69921ZM3.17342 16.115L2.92376 16.1281L2.96793 16.975L3.39022 16.2395L3.17342 16.115ZM7.43748 8.68924L7.65428 8.81373L7.75962 8.63027L7.59612 8.49602L7.43748 8.68924ZM4.0759 17.4767L3.8591 17.3522L3.63053 17.7503L4.08892 17.7264L4.0759 17.4767ZM24.5713 16.4078L24.5843 16.6575L25.0465 16.6334L24.7729 16.2601L24.5713 16.4078ZM18.9259 8.70259L19.1276 8.55484L18.9594 8.32534L18.7535 8.5216L18.9259 8.70259ZM15.3864 12.075L15.2139 11.894L15.3864 12.075ZM11.7255 12.2101L11.5669 12.4033L11.7255 12.2101ZM8.58215 9.62912L8.7408 9.4359L8.51247 9.24843L8.36535 9.50463L8.58215 9.62912ZM26.548 16.6343L26.3185 16.5351L26.2617 16.6665L26.3463 16.7821L26.548 16.6343ZM26.7113 15.7223L26.4617 15.7353L26.4617 15.7353L26.7113 15.7223ZM26.0455 2.95555L26.2952 2.94253L26.2952 2.94253L26.0455 2.95555ZM23.9085 1.0304L23.8955 0.780739L23.9085 1.0304ZM3.01747 2.11992L3.00445 1.87026L3.01747 2.11992ZM1.09232 4.25692L0.842664 4.26994L1.09232 4.25692ZM1.75814 17.0237L2.0078 17.0106L1.75814 17.0237ZM3.89514 18.9488L3.88211 18.6991L3.88211 18.6991L3.89514 18.9488ZM24.7862 17.8593L24.7992 18.109L24.7992 18.109L24.7862 17.8593ZM26.3771 16.9497L26.2293 16.7481L26.1933 16.7745L26.1686 16.8117L26.3771 16.9497ZM26.6387 16.7581L26.7864 16.9597L26.9881 16.812L26.8403 16.6103L26.6387 16.7581ZM25.2003 14.7949L24.9986 14.9426L25.4936 15.6182L25.4499 14.7818L25.2003 14.7949ZM19.9923 7.68656L19.8198 7.50557L19.6608 7.65711L19.7906 7.83432L19.9923 7.68656ZM24.6006 3.29576L24.8502 3.28274L24.8219 2.73957L24.4281 3.11477L24.6006 3.29576ZM23.2788 2.27557L3.4769 3.30829L3.50295 3.80761L23.3048 2.77489L23.2788 2.27557ZM12.8111 10.888L3.64857 3.36473L3.33128 3.75116L12.4938 11.2744L12.8111 10.888ZM14.2063 10.8365C13.821 11.2037 13.2224 11.2257 12.8111 10.888L12.4938 11.2744C13.1003 11.7725 13.9831 11.7399 14.5513 11.1985L14.2063 10.8365ZM23.1193 2.34424L14.2063 10.8365L14.5513 11.1985L23.4642 2.70623L23.1193 2.34424ZM2.3284 4.71223L2.92376 16.1281L3.42308 16.102L2.82772 4.68619L2.3284 4.71223ZM7.22068 8.56474L2.95662 15.9906L3.39022 16.2395L7.65428 8.81373L7.22068 8.56474ZM2.41942 4.89243L7.27883 8.88245L7.59612 8.49602L2.73671 4.506L2.41942 4.89243ZM4.08892 17.7264L24.5843 16.6575L24.5583 16.1582L4.06288 17.227L4.08892 17.7264ZM18.7242 8.85035L24.3696 16.5556L24.7729 16.2601L19.1276 8.55484L18.7242 8.85035ZM15.5589 12.256L19.0984 8.88359L18.7535 8.5216L15.2139 11.894L15.5589 12.256ZM11.5669 12.4033C12.7437 13.3696 14.4564 13.3064 15.5589 12.256L15.2139 11.894C14.2944 12.7702 12.8658 12.8229 11.8842 12.0169L11.5669 12.4033ZM8.4235 9.82233L11.5669 12.4033L11.8842 12.0169L8.7408 9.4359L8.4235 9.82233ZM4.2927 17.6012L8.79895 9.75361L8.36535 9.50463L3.8591 17.3522L4.2927 17.6012ZM26.7775 16.7336C26.9129 16.4205 26.9799 16.0722 26.961 15.7093L26.4617 15.7353C26.4765 16.0196 26.4241 16.2911 26.3185 16.5351L26.7775 16.7336ZM26.961 15.7093L26.2952 2.94253L25.7958 2.96857L26.4617 15.7353L26.961 15.7093ZM26.2952 2.94253C26.2295 1.68291 25.1551 0.715047 23.8955 0.780739L23.9215 1.28006C24.9054 1.22875 25.7445 1.98472 25.7958 2.96857L26.2952 2.94253ZM23.8955 0.780739L3.00445 1.87026L3.03049 2.36958L23.9215 1.28006L23.8955 0.780739ZM3.00445 1.87026C1.74484 1.93595 0.776972 3.01032 0.842664 4.26994L1.34199 4.2439C1.29068 3.26005 2.04665 2.42089 3.03049 2.36958L3.00445 1.87026ZM0.842664 4.26994L1.50848 17.0367L2.0078 17.0106L1.34199 4.2439L0.842664 4.26994ZM1.50848 17.0367C1.57417 18.2963 2.64854 19.2642 3.90816 19.1985L3.88211 18.6991C2.89827 18.7505 2.05911 17.9945 2.0078 17.0106L1.50848 17.0367ZM3.90816 19.1985L24.7992 18.109L24.7732 17.6096L3.88211 18.6991L3.90816 19.1985ZM24.7992 18.109C25.5515 18.0697 26.1998 17.6704 26.5855 17.0877L26.1686 16.8117C25.8666 17.2679 25.3605 17.579 24.7732 17.6096L24.7992 18.109ZM26.5248 17.1514L26.7864 16.9597L26.4909 16.5564L26.2293 16.7481L26.5248 17.1514ZM26.8403 16.6103L26.7497 16.4866L26.3463 16.7821L26.437 16.9058L26.8403 16.6103ZM25.402 14.6471L20.1939 7.53881L19.7906 7.83432L24.9986 14.9426L25.402 14.6471ZM20.1647 7.86756L24.773 3.47676L24.4281 3.11477L19.8198 7.50557L20.1647 7.86756ZM25.4499 14.7818L24.8502 3.28274L24.3509 3.30878L24.9506 14.8079L25.4499 14.7818Z"
                  fill="#318DB5"
                />
              </svg>
            }
          >
            <span className="text-lg font-bold">
              hallo@kitaplatz-zentrale.de
            </span>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;
