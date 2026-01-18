# Node.js 20のdockerイメージを使用
FROM node:20-alpine

# コンテナ内の作業ディレクトリを/appに設定
WORKDIR /app

# npm installを実行するために、
# package.jsonとpackage-lock.jsonを/appにコピー
COPY package*.json ./

# npm installを実行
RUN npm install

# frontendディレクトリの中身を全てコンテナの/appにコピー
COPY . .

# コンテナで使用するポートの指定(Viteの開発サーバ)
EXPOSE 5173

# コンテナ起動時のメインコマンド
# npm run dev -- --host
# "--host"はViteがlocalhostだけでなく、
# コンテナ外からもアクセス可能とするため
CMD ["npm", "run", "dev", "--", "--host"]
