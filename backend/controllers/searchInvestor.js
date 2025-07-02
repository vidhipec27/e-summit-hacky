import Investor from "../models/investor.js";
import dotenv from 'dotenv'; 
import { client } from "../app.js";

dotenv.config(); 

export const searchInvestorFiltered = async (req, resp) => {
    try {
        const experience = req.params.experience;
        const domain = req.params.domain;
        const name = req.params.name;
        
        const query = {
            ...(experience !== '!' && { experience }),
            ...(domain !== '!' && { domain }),
            ...(name !== '!' && { username: new RegExp("^" + name, "i") }),
        };
        
        const result = await Investor.find(query);
        // console.log(result);

        resp.status(200).json({success:true,result});
    } catch (error) {
        console.log("error in filtering investors", error);
        resp.status(500).send(error);
    }
}

export const storeSearches = async (req, resp) => {
    try {
        const search = req.body.name;
        const emailid = req.user.emailid;

        const key = `entreconnect:entre:${emailid}:searches`;

        const existingSearch = await client.lRange(key, 0, -1);
        if (!existingSearch.includes(search)) {
            await client.lPush(key, search.toLowerCase());
            await client.lTrim(key, 0, 4);
        }

        resp.status(200).json({success: true});

    } catch (error) {
        console.log("error in storing searches", error);
        resp.status(500).send(error);
    }
}

export const getSearches = async (req, resp) => {
    try {
        const name = req.params.name;
        const emailid = req.user.emailid;

        const key = `entreconnect:entre:${emailid}:searches`;

        const searches = await client.lRange(key, 0, -1);
        
        const filteredSearches = name !== '!' ? searches.filter((search) =>
            search.toLowerCase().startsWith(name.toLowerCase())) : searches;

        resp.status(200).json({success : true, searches: filteredSearches});

    } catch (error) {
        console.log("error in getting stored searches", error);
        resp.status(500).send(error);
    }
}


export const getInvestorDetails = async(req, resp) => {
    try {
        const email = req.body.emailid;
        const result = await Investor.find({emailid: email});
        resp.status(200).json({success:true,result});
    } catch (error) {
        console.log("error in searching investors", error);
        resp.status(500).send(error);
    }
}