FROM jarredsumner/bun:edge
RUN bun upgrade
WORKDIR /src
COPY package.json package.json
COPY bun.lockb bun.lockb
RUN bun install
COPY . .
EXPOSE 3000
ENTRYPOINT ["bun", "run", "src/index.ts"]
