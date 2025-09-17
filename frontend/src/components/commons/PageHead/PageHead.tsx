import Head from "next/head";

interface PageHeadProps {
  title?: string;
}

const PageHead = ({ title = "auth" }: PageHeadProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
};

export default PageHead;
