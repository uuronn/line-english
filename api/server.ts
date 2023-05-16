// すべての依存関係をインポートし、見やすくするために構造化
import {
  ClientConfig,
  Client,
  middleware,
  MiddlewareConfig,
  WebhookEvent,
  TextMessage,
  MessageAPIResponseBase
} from "@line/bot-sdk";
import express, { Application, Request, Response } from "express";
require("dotenv").config();

// LINEクライアントとExpressの設定を行う
const clientConfig: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || "",
  channelSecret: process.env.CHANNEL_SECRET
};

const middlewareConfig: MiddlewareConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET || ""
};

const PORT = process.env.PORT || 3000;

// LINE SDKクライアントを新規に作成
const client = new Client(clientConfig);

// Expressアプリケーションを新規に作成
const app: Application = express();

// テキストを受け取る関数
const textEventHandler = async (
  event: WebhookEvent
): Promise<MessageAPIResponseBase | undefined> => {
  // すべての変数を処理
  if (event.type !== "message" || event.message.type !== "text") {
    return;
  }

  // メッセージに関連する変数をこちらで処理
  const { replyToken } = event;
  const { text } = event.message;

  // 新規メッセージの作成
  const response: TextMessage = {
    type: "text",
    text
  };

  // ユーザーに返信
  await client.replyMessage(replyToken, response);
};

// LINEミドルウェアを登録
// ルートハンドラの中でミドルウェアを渡すことも可能↓
// app.use(middleware(middlewareConfig));

// Webhookイベントを受信する
// 接続テストを受信
app.get("/", async (_: Request, res: Response): Promise<Response> => {
  return res.status(200).json({
    status: "成功",
    message: "正常に接続されました!"
  });
});

// Webhookに使用されるルート
app.post(
  "/webhook",
  middleware(middlewareConfig),
  async (req: Request, res: Response): Promise<Response> => {
    const events: WebhookEvent[] = req.body.events;

    // 受信したすべてのイベントを非同期で処理
    const results = await Promise.all(
      events.map(async (event: WebhookEvent) => {
        try {
          await textEventHandler(event);
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error(err);
          }

          // エラーメッセージを返す
          return res.status(500).json({
            status: "エラー"
          });
        }
      })
    );

    // 成功した場合のメッセージを返す
    return res.status(200).json({
      status: "成功",
      results
    });
  }
);

// サーバーを作成し3000listenする
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
