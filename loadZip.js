import JSZip from "jszip";
import FileSaver from "file-saver";
import axios from "axios";

const loadZip = async (fileArr, zipName = '下载文件') => {
    fileArr.forEach(el=>{
        el.fvName = `${el.fvName}.${el.fvUrl.split('.').at(-1)}`  // 截取url的后缀名添加到文件名： fvname.jpg
    })
    const zip = new JSZip(); // 创建实例对象
    const promises = [];
    // 遍历生成下载文件
    fileArr.forEach((item) => {
        const promise = getFile(item.fvUrl).then((res) => {
            const fvName = item.fvName + ''
            // 创建文件用file()，创建文件夹用 floder()
            zip.file(fvName, res.data, {
                binary: true
            })
        })
        promises.push(promise)
    })
    Promise.all(promises).then(() => {
        // 生成zip 文件
        zip.generateAsync({
            type: 'blob',  // 文件格式
            compression: 'DEFLATE', // STORE: 默认不压缩， DEFLATE：需要压缩
            compressionOptions: {
                level: 9 // 压缩等级 1~9   1 压缩速度最快， 9 最优压缩方式
            }
        }).then((res) => {
            console.log('开始保存了'+res);
            FileSaver.saveAs(res, `${zipName}.zip`) // 使用FileSaver.saveAs保存文件，文件名可自定义
        })
    })
}
const getFile = (fvUrl) => {
    return new Promise((resolve, reject) => {
        axios(fvUrl, {
            method: 'get',  // get请求
            responseType: 'blob' // 返回的数据会被强制转为blob类型 ，转换成arraybuffer 也行
        }).then((res) => {
            resolve(res) // 将下载的文件返回
        }).catch(err => {
            reject(err)
        })
    })
}

let picUrls= [
    {fvUrl:'http://www.jsrsrc.com/data/comads/2019/10/22/1571722047949.jpg',
        fvName: '图片名称1'},
    {fvUrl:'http://www.jsrsrc.com/data/comads/2019/10/22/1571723835752.jpg',
        fvName: '图片名称2'}
];
loadZip(picUrls);
//export default loadZip;