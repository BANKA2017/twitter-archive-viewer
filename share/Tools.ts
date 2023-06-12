import * as zip from "@zip.js/zip.js";
import {Entry} from "@zip.js/zip.js";

const ScrollTo = (top: number = 0): void => {
  window.scrollTo({
    top: top,
    behavior: "smooth"
  });
};

const Download = (url: string, fileName: string) => {
  let element = document.createElement('a');
  element.setAttribute('href', url);
  element.setAttribute('download', fileName);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

const readFile = async (fileHandle: FileSystemFileHandle | Entry, type: 'text' | 'blob' = 'text') => {
  return await new Promise(async (resolve, reject) => {
    let file
    if (fileHandle.handle && fileHandle.handle.getFile) {
      file = await fileHandle.handle.getFile()
    } else if ("getFile" in fileHandle) {
      file = await fileHandle.getFile()
    } else if (fileHandle.getData) {
      if (type === "text") {
        resolve({content: await fileHandle.getData(new zip.TextWriter(), {}), handle: fileHandle})
      } else {
        resolve({content: await fileHandle.getData(new zip.BlobWriter(), {}), handle: fileHandle})
      }
    } else if (("text" in fileHandle && type === 'text') || ("blob" in fileHandle && type === 'blob')) {
      //console.log(fileHandle.text, fileHandle.blob)
      if (type === "text") {
        resolve({content: await fileHandle.text(), handle: fileHandle})
      } else {
        resolve({content: await fileHandle.blob(), handle: fileHandle})
      }
    }

    if (!file) {
      reject({content: null, handle: fileHandle})
      return
    }
    let reader = new FileReader();
    reader.readAsArrayBuffer(file)
    reader.onload = async function (e) {
      const result = reader.result
      if (!result || typeof result === 'string') {
        reject({content: null, handle: fileHandle})
      } else if (result) {
        try {
          const content = type === 'text' ? (new TextDecoder()).decode(result) : new Blob([result])
          resolve({content, handle: fileHandle})
        } catch (e) {
          console.error(e)
          reject({content: null, handle: fileHandle})
        }
      }
      reject({content: null, handle: fileHandle})
    }
  })

}

const OpenNewPage = (url: string = '') => {
  window.open(url)
}
export {ScrollTo, Download, readFile, OpenNewPage}
