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

      {/* Favicon utama */}
      <link rel="icon" href="/images/favicon_io/favicon.ico" />

      {/* Tambahan untuk berbagai perangkat */}
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/images/favicon_io/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/images/favicon_io/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/images/favicon_io/favicon-16x16.png"
      />
      <link rel="manifest" href="/images/favicon_io/site.webmanifest" />
    </Head>
  );
};

export default PageHead;
