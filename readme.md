# Hono with Bun runtime
Deployed to railway.app using docker

Not sure about the name yet. `vuurbao` ? `hot-buns` ?

# Deploying a bun/hono app with docker
## project setup
in your shell:
- `bun create hono ./hono-app`
- `cd hono-app`
- `bun install`
- `touch Dockerfile`
- `nvim Dockerfile`
- add the following lines to the Dockerfile:
```docker
FROM jarredsumner/bun:edge
WORKDIR /src
COPY package.json package.json
COPY bun.lockb bun.lockb
RUN bun install
COPY . .
EXPOSE 3000
ENTRYPOINT ["bun", "run", "src/index.ts"]
```

## adding git and uploading the repo to github
- go to [github.com](https://github.com), login, create a new repo.
- go back to the terminal and inside the project directory 
- `git init`
- `git branch -M main`
- `git remote add origin (git repo url here)`
- `git push -u origin main`
- create a dev branch because we supposedly want to do things correctly `git checkout -b dev`
- `git push -u origin dev`

## deploying to railway with the railway CLI
- go to [railway.app](https://railway.app)
- download the CLI
- No permission for the installation? Do you have [this](https://github.com/railwayapp/cli/issues/277) error? Then run one of the following depending on your shell.

*bash*: 
```bash
 sudo chown -R $(whoami) /usr/local/bin
```
*fish*:
```fish
 sudo chown -R (whoami) /usr/local/bin
 ```

- make sure the `railway` command runs after installing.
- `railway login`, login to your railway account
<!-- TODO: actually document this last step I guess -->
- ... 

done.

profit?

good job you did it anyhow