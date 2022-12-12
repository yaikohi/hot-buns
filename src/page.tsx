export const Layout = (props: { children?: string }) => {
  return (
    <html>
      <body>{props.children}</body>
    </html>
  );
};

export const Top = (props: { messages: string[] }) => {
  return (
    <Layout>
      <h1>Welcome</h1>
      <ul>
        {props.messages.map((message) => {
          return <li>{message}~</li>;
        })}
      </ul>
    </Layout>
  );
};
