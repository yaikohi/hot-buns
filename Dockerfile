FROM jarredsumner/bun:edge
WORKDIR /src
COPY package.json package.json
COPY bun.lockb bun.lockb
RUN curl https://bun.sh/install | bash
RUN bun install
COPY . .
EXPOSE 5000
ENTRYPOINT ["bun", "run", "src/index.ts"]
