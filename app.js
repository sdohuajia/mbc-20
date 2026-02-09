import fs from 'fs';
import path from 'path';
import { signMessage } from './sign_message/bsc.js';
import { sendToAI } from './ai_agent/ai_message.js';
import { signMessage as solSignMessage } from './sign_message/sol_sign_message.js';
import { getApiKey, createPost, handleVerificationResponse, registerAndSave } from './function/molt.js';
import { analyzeChallengeText } from './function/molt_nft.js';

const privateKey = '';
const SOL_PRIVATE_KEY = '';
const message = 'Hello, world!';

// const clawtPath = path.join(process.cwd(), 'skill', 'clawt.md');
// const clawtText = fs.readFileSync(clawtPath, 'utf8');
// const challengeAnswer = await analyzeChallengeText(clawtText, sendToAI);
// console.log('clawt 挑战题分析结果:', challengeAnswer);

// const registerResult = await register('testagentbot111122112', 'AI agent registered via script');
// console.log('Moltbook 注册结果:', registerResult);

async function postMoltbook(options = {}) {
  const {
    title = "M2 Max Auto Mint",
    content = 'Steady minting from HK.{"p":"mbc-20","op":"mint","tick":"CLAW","amt":"100"}',
    submolt = "general",
  } = options;
  const apiKey = getApiKey();
  return createPost(apiKey, { submolt, title, content });
}

try {
  const post = await postMoltbook();
  console.log("\x1b[32m%s\x1b[0m", "✅ Moltbook 发帖成功:", post);

  if (post?.verification_required) {
    const verifyResult = await handleVerificationResponse(post, sendToAI);
    if (verifyResult) console.log("\x1b[36m%s\x1b[0m", "ℹ️ Moltbook 验证结果:", verifyResult);
  }
} catch (error) {
  const msg = error.message || String(error);
  if (msg.includes("429") || msg.includes("2 hours")) {
    console.log("\n\x1b[33m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\x1b[33m%s\x1b[0m", "⚠️  频率过快：每 2 小时只能发帖一次，请稍后再试。");
    console.log("\x1b[33m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } else {
    console.log("\n\x1b[31m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\x1b[31m%s\x1b[0m", `❌  执行出错: ${msg}`);
    console.log("\x1b[31m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  }
}