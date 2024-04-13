//const express = require('express') ,IPFS要求要下面一种风格
import express from 'express';
//解析post数据
import bodyParser from 'body-parser';
//获取上传的文件、图片
import fileUpload from 'express-fileupload';
//其他文件的函数
import { uploadFileToIPFS, uploadJSONToIPFS } from './ipfs-uploader.js';
import { mint } from './nft-minter.js';

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());

app.get('/', (req, res) => {
    
    res.render('home');
});

app.post('/upload', (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    //console.log(title, description)
    
    const file = req.files.file;
    const filename = file.name;
    const filePath = "files/" + filename;
    //console.log(filePath);

    //移动并保存文件
    file.mv(filePath, async (err) => {
        if (err) {
            console.log(err);
            res.status(500).send("error occured");
        }

        //将文件保存到ipfs
        //异步函数在调用的时候也要加await
        const fileResult = await uploadFileToIPFS(filePath);
        const fileCid = fileResult.cid.toString();

        //封装成metadata
        const metadata = {
            title: title,
            description: description,
            image: 'http://192.168.241.130:8080/ipfs/' + fileCid
        }

        const metadataResult = await uploadJSONToIPFS(metadata);
        const metadataCid = metadataResult.cid.toString();
        console.log(metadataCid);

        //应该要获取用户的地址，还没操作前端，先定为第一个地址
        await mint('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 'http://127.0.0.1:8080/ipfs/' + metadataCid);

        res.json(
            {
                message:"file uploaded successful",
                metadata:metadata
            }
        )
    })

    //随便返回的数据
    
})

//启动服务器监听
app.listen(3000, () => {
    console.log('Example app listening on port 3000');
});