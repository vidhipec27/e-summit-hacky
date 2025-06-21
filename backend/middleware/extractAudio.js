import fs from "fs"
import ffmpeg from "fluent-ffmpeg"
import ffmpegPath from "ffmpeg-static"
import path from "path"

ffmpeg.setFfmpegPath(ffmpegPath);

export const extractAudio=async(input,output)=>{
    return new Promise((resolve,reject)=>{
        ffmpeg(input).noVideo()
        .audioCodec("pcm_s16le")//wav (waverform audio file format)
        .save(output)
        .on("end",()=>{
            console.log("extraction donezo",output);
            resolve(output);
        })
        .on("error",(err)=>{
            console.log("error ho gaya (extractAudio)",err.message);
            reject(err);
        });
    });
};