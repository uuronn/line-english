import {
  ClientConfig,
  Client,
  middleware,
  MiddlewareConfig,
  WebhookEvent,
  MessageAPIResponseBase
} from "@line/bot-sdk";
import express, { Application, Request, Response } from "express";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
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

  const docRef = doc(db, "option", "pmctKxIvuS1ZTtdeEHQg");
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return;

  const { replyToken } = event;

  // モード切り替え
  switch (event.message.text) {
    case "スタート":
      client.replyMessage(replyToken, {
        type: "flex",
        altText: "モード設定",
        contents: {
          type: "bubble",
          direction: "ltr",
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "モードを選択してください。",
                size: "md",
                align: "start",
                wrap: true
              }
            ]
          },
          footer: {
            type: "box",
            layout: "vertical",
            spacing: "md",
            margin: "none",
            contents: [
              {
                type: "button",
                action: {
                  type: "postback",
                  label: "英単語",
                  text: "英単語",
                  data: "英単語"
                },
                style: "primary"
              },
              {
                type: "button",
                action: {
                  type: "postback",
                  label: "英文",
                  text: "英文",
                  data: "英文"
                },
                style: "primary"
              }
            ]
          }
        }
      });
      return;

    case "英単語":
      await updateDoc(docRef, {
        mode: "英単語"
      });
      client.replyMessage(replyToken, {
        type: "text",
        text: "英単語モードに切り替えました。"
      });
      return;

    case "英文":
      await updateDoc(docRef, {
        mode: "英文"
      });
      client.replyMessage(replyToken, {
        type: "text",
        text: "英文モードに切り替えました。"
      });
      return;
  }

  // モードによってテキストの見方を変える
  switch (docSnap.data().mode) {
    case "英単語":
      console.log("英単語の方", event.message.text);
      client.replyMessage(replyToken, {
        type: "text",
        text: "英単語モードです。"
      });
      break;
    case "英文":
      console.log("英文の方", event.message.text);
      client.replyMessage(replyToken, {
        type: "text",
        text: "英文モードです。"
      });
      break;
  }

  // if (event.message.text === "スタート")
  //   return client.replyMessage(replyToken, {
  //     type: "flex",
  //     altText: "モード設定",
  //     contents: {
  //       type: "bubble",
  //       direction: "ltr",
  //       body: {
  //         type: "box",
  //         layout: "vertical",
  //         contents: [
  //           {
  //             type: "text",
  //             text: "モードを選択してください。",
  //             size: "md",
  //             align: "start",
  //             wrap: true
  //           }
  //         ]
  //       },
  //       footer: {
  //         type: "box",
  //         layout: "vertical",
  //         spacing: "md",
  //         margin: "none",
  //         contents: [
  //           {
  //             type: "button",
  //             action: {
  //               type: "postback",
  //               label: "英単語",
  //               text: "英単語",
  //               data: "英単語"
  //             },
  //             style: "primary"
  //           },
  //           {
  //             type: "button",
  //             action: {
  //               type: "postback",
  //               label: "英文",
  //               text: "英文",
  //               data: "英文"
  //             },
  //             style: "primary"
  //           }
  //         ]
  //       }
  //     }
  //   });

  // switch (event.message.text) {
  //   case "スタート":
  //     client.replyMessage(replyToken, {
  //       type: "flex",
  //       altText: "モード設定",
  //       contents: {
  //         type: "bubble",
  //         direction: "ltr",
  //         body: {
  //           type: "box",
  //           layout: "vertical",
  //           contents: [
  //             {
  //               type: "text",
  //               text: "モードを選択してください。",
  //               size: "md",
  //               align: "start",
  //               wrap: true
  //             }
  //           ]
  //         },
  //         footer: {
  //           type: "box",
  //           layout: "vertical",
  //           spacing: "md",
  //           margin: "none",
  //           contents: [
  //             {
  //               type: "button",
  //               action: {
  //                 type: "postback",
  //                 label: "英単語",
  //                 text: "英単語",
  //                 data: "英単語"
  //               },
  //               style: "primary"
  //             },
  //             {
  //               type: "button",
  //               action: {
  //                 type: "postback",
  //                 label: "英文",
  //                 text: "英文",
  //                 data: "英文"
  //               },
  //               style: "primary"
  //             }
  //           ]
  //         }
  //       }
  //     });
  //     break;
  //   case "英単語":
  //     await updateDoc(docRef, {
  //       mode: "単語"
  //     });
  //     client.replyMessage(replyToken, {
  //       type: "flex",
  //       altText: "単語",
  //       contents: {
  //         type: "bubble",
  //         direction: "ltr",
  //         body: {
  //           type: "box",
  //           layout: "vertical",
  //           contents: [
  //             {
  //               type: "text",
  //               text: "「りんご」を英語で入力してください。\n（全て小文字）",
  //               size: "md",
  //               align: "start",
  //               wrap: true
  //             }
  //           ]
  //         }
  //       }
  //     });
  //     break;
  //   case "英文":
  //     client.replyMessage(replyToken, {
  //       type: "flex",
  //       altText: "こんにちは",
  //       contents: {
  //         type: "bubble",
  //         direction: "ltr",
  //         body: {
  //           type: "box",
  //           layout: "vertical",
  //           contents: [
  //             {
  //               type: "text",
  //               text: "問題1",
  //               weight: "bold",
  //               align: "center",
  //               margin: "none"
  //             },
  //             {
  //               type: "text",
  //               text: "以下の英文を英語に翻訳するとどれが正しいですか？",
  //               size: "md",
  //               align: "start",
  //               margin: "xxl",
  //               wrap: true
  //             },
  //             {
  //               type: "text",
  //               text: " 「昨日、宿題をするのを忘れてしまった。」",
  //               size: "md",
  //               margin: "lg",
  //               wrap: true
  //             }
  //           ]
  //         },
  //         footer: {
  //           type: "box",
  //           layout: "vertical",
  //           spacing: "md",
  //           contents: [
  //             {
  //               type: "box",
  //               layout: "horizontal",
  //               spacing: "lg",
  //               contents: [
  //                 {
  //                   type: "button",
  //                   action: {
  //                     type: "postback",
  //                     label: "1",
  //                     text: "1",
  //                     data: "1"
  //                   },
  //                   flex: 2,
  //                   margin: "none",
  //                   height: "sm",
  //                   style: "primary",
  //                   gravity: "top"
  //                 },
  //                 {
  //                   type: "text",
  //                   text: "I forgot to do my homework yesterday.",
  //                   flex: 8,
  //                   align: "start",
  //                   gravity: "center",
  //                   wrap: true
  //                 }
  //               ]
  //             },
  //             {
  //               type: "box",
  //               layout: "horizontal",
  //               spacing: "lg",
  //               contents: [
  //                 {
  //                   type: "button",
  //                   action: {
  //                     type: "postback",
  //                     label: "2",
  //                     text: "2",
  //                     data: "2"
  //                   },
  //                   flex: 2,
  //                   margin: "none",
  //                   height: "sm",
  //                   style: "primary",
  //                   gravity: "top"
  //                 },
  //                 {
  //                   type: "text",
  //                   text: "I forgot to do my homework yesterday.",
  //                   flex: 8,
  //                   align: "start",
  //                   gravity: "center",
  //                   wrap: true
  //                 }
  //               ]
  //             },
  //             {
  //               type: "box",
  //               layout: "horizontal",
  //               spacing: "lg",
  //               contents: [
  //                 {
  //                   type: "button",
  //                   action: {
  //                     type: "postback",
  //                     label: "3",
  //                     text: "3",
  //                     data: "3"
  //                   },
  //                   flex: 2,
  //                   margin: "none",
  //                   height: "sm",
  //                   style: "primary",
  //                   gravity: "top"
  //                 },
  //                 {
  //                   type: "text",
  //                   text: "I forgot to do my homework yesterday.",
  //                   flex: 8,
  //                   align: "start",
  //                   gravity: "center",
  //                   wrap: true
  //                 }
  //               ]
  //             },
  //             {
  //               type: "box",
  //               layout: "horizontal",
  //               spacing: "lg",
  //               contents: [
  //                 {
  //                   type: "button",
  //                   action: {
  //                     type: "postback",
  //                     label: "4",
  //                     text: "4",
  //                     data: "4"
  //                   },
  //                   flex: 2,
  //                   margin: "none",
  //                   height: "sm",
  //                   style: "primary",
  //                   gravity: "top"
  //                 },
  //                 {
  //                   type: "text",
  //                   text: "I forgot to do my homework yesterday.",
  //                   flex: 8,
  //                   align: "start",
  //                   gravity: "center",
  //                   wrap: true
  //                 }
  //               ]
  //             }
  //           ]
  //         }
  //       }
  //     });
  //     break;
  //   case "apple":
  //     client.replyMessage(replyToken, {
  //       type: "text",
  //       text: "正解!"
  //     });
  //     break;
  //   case "1":
  //     client.replyMessage(replyToken, {
  //       type: "text",
  //       text: "正解!"
  //     });
  //     break;
  //   case "2":
  //     client.replyMessage(replyToken, {
  //       type: "text",
  //       text: "不正解"
  //     });
  //     break;
  //   case "3":
  //     client.replyMessage(replyToken, {
  //       type: "text",
  //       text: "不正解"
  //     });
  //     break;
  //   case "4":
  //     client.replyMessage(replyToken, {
  //       type: "text",
  //       text: "不正解"
  //     });
  //     break;
  //   default:
  //     client.replyMessage(replyToken, {
  //       type: "text",
  //       text: "「スタート」と入力してモードを選んでください。"
  //     });
  //     break;
  // }
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
