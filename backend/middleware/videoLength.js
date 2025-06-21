import ffmpeg from "fluent-ffmpeg"
import ffprobe  from "ffprobe-static"
import fs from "fs"

ffmpeg.setFfprobePath(ffprobe.path);

export const videoDuration=(req,resp,next)=>{
    if(!req.file)
       return next();

    ffmpeg.ffprobe(req.file.path,(err,metadata)=>{
        if(err)
            return resp.status(500).json({"error":err.message});

        const duration=metadata.format.duration;//in seconds
        if(duration>120){
            fs.unlinkSync(req.file.path);
            return resp.status(400).json({"error":"Video exceeds limit, shorten it to 2 minutes please!"});
        }
        next();
    })
};