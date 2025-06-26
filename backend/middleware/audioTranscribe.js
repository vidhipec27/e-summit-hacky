import { extractAudio } from "./extractAudio.js";
import { transcribe } from "./transcribe.js";
import fs from "fs";
import Entre from "../models/entre.js";

export const audioTranscribe=async(req,resp,next)=>{
    try{
        if(!req.file)
            return next();
        
        const emailid=req.body.emailid;
        const entre=await Entre.findOne({emailid});
        const input=req.file.path;
        const output=input.replace(/\.\w+$/, '.wav');//regex
        await extractAudio(input,output);

        const transcript=await transcribe(output);
        req.body.transcript=transcript;
        entre.transcript=transcript;
        await entre.save();
        fs.unlinkSync(output);
        next();
    }
    catch(err){
        return resp.status(500).json({"error":err.message});
    }
}