// import openai from "openai";
// import fs from "fs";
// import dotenv from "dotenv";
// dotenv.config();

// const apiKey=process.env.OPEN_AI_API_KEY;

// export const transcribe=async(output)=>{
//     try{
//         const openAi=new openai.OpenAI({apiKey});
//         const transcript=await openAi.audio.transcriptions.create({
//             file:fs.createReadStream(output),
//             model:"whisper-1"
//         })
//         return transcript;
//     }catch(err){
//         console.log("error is (transcribe.js) ",err.message);
//     }
// }

import fs from "fs";
import dotenv from "dotenv";
import { createClient } from "@deepgram/sdk";
dotenv.config();

const deepgramApiKey = process.env.DEEPGRAM_API_KEY;
const deepgram = new createClient(deepgramApiKey);

export const transcribe = async (output) => {
  try {
    const audioBuffer = fs.readFileSync(output); // read audio file as buffer

    const response = await deepgram.listen.prerecorded.transcribeFile(audioBuffer,{
    mimetype: "audio/wav",   
      smart_format: true,
      punctuate: true,
      language: "en"
    });

    //console.log("Deepgram response:", JSON.stringify(response, null, 2));

    const transcript = response?.result?.results?.channels?.[0]?.alternatives?.[0]?.transcript;
    return transcript || "";
  } catch (err) {
    console.log("error is (transcribe.js) ", err.message);
    return null;
  }
};
