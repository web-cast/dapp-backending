//与IPFS进行交互
import { create } from 'kubo-rpc-client';
import fs from 'fs';
import express from 'express';

//connect to ipfs daemon API server
const ipfs = create('http://192.168.241.130:5001');

export async function uploadFileToIPFS(filePath) {
    const file = fs.readFileSync(filePath);
    const result = await ipfs.add({
        path:filePath,
        content: file
    });
    return result;
}


export async function uploadJSONToIPFS(json) {
    const result = await ipfs.add(JSON.stringify(json));
    return result;
}
