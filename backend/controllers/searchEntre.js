import Entre from '../models/entre.js';
import dotenv from 'dotenv'; 
import { client } from '../app.js';

dotenv.config(); 

export const searchEntreScore=async(req,resp)=>{
    try{
        const name = req.params.name;
        const regex = new RegExp("^" + name, "i");

        const entre = name !== '!' ? await Entre.find({username: regex}) : await Entre.find();

        const scored=entre.map((entry)=>{
            let score=0;
            const ss=entry.startupStage+1;
            const ts=entry.teamSize+1;
            const exp=entry.experience+1;
            if(!isNaN(entry.averageRating)){
                score=((ss*20)+(ts*4)+(exp*7)+(entry.averageRating*15))*0.4405;
            }
            else{
                score=((ss*20)+(ts*4)+(exp*7))*0.6579;
            }
    return{
        username:entry.username,
        emailid:entry.emailid,
        number:entry.number,
        needFunding:entry.needFunding,
        score:Number(score.toFixed(2))
    }
        });
    const result=scored
        .filter(e=>typeof e.score === 'number' && !isNaN(e.score))
        .sort((a,b)=>b.score-a.score)
        .slice(0,20);
    resp.status(200).json({success:true,result});
    }
    catch(error){
        resp.status(500).json({"error":error.message});
    }
}
export const searchEntre = async(req, resp) => {
    try {
        const result = await Entre.find();
        console.log(result)
        resp.status(200).json({success:true,result});
    } catch (error) {
        console.log("error in searching entrepreneurs", error);
        resp.status(500).send(error);
    }
}

export const storeSearchesEntre = async (req, resp) => {
    try {
        const search = req.body.name;
        const emailid = req.user.emailid;

        const key = `entreconnect:investor:${emailid}:searches`;
        
        const existingSearch = await client.lRange(key, 0, -1);
        if (!existingSearch.includes(search)) {
            await client.lPush(key, search.toLowerCase()); // to make it case insensitive
            await client.lTrim(key, 0, 4);
        }

        resp.status(200).json({success: true});

    } catch (error) {
        console.log("error in storing searches", error);
        resp.status(500).send(error);
    }
}

export const getSearchesEntre = async (req, resp) => {
    try {
        const name = req.params.name;
        const emailid = req.user.emailid;

        const key = `entreconnect:investor:${emailid}:searches`;

        const searches = await client.lRange(key, 0, -1);
        
        const filteredSearches = name !== '!' ? searches.filter((search) =>
            search.toLowerCase().startsWith(name.toLowerCase())) : searches;

        resp.status(200).json({success : true, searches: filteredSearches});
    } catch (error) {
        console.log("error in getting searches", error);
        resp.status(500).send(error);
    }
}

export const getEntreDetails = async(req, resp) => {
    try {
        const email = req.params.emailid;
        const result = await Entre.find({emailid: email});
        resp.status(200).json({success:true,result});
    } catch (error) {
        console.log("error in searching entre", error);
        resp.status(500).send(error);
    }
}