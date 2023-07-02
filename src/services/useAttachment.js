import { ref } from "vue";
import attachmentApi from "@/apis/attachmentApi";
import enums from "@/constants/enums";

export function useAttachments() {
    const attachments = ref([])
    const removedAttachments = ref([])

    const getFileKey = async (refId, refType) => {
        attachments.value = []
        removedAttachments.value = []
        let res = await attachmentApi.getFileKeyByRef(refId, refType)
        if (res && res.status == 200) {
            let fileKeys = res.data
            fileKeys.forEach(fileKey => {
                getAttachment(fileKey)
            });
        }
    }

    const getAttachment = async (fileName) => {
        let res = await attachmentApi.getByKey(fileName)
        if (res && res.status == 200) {
            let fileObj = {
                href: URL.createObjectURL(res.data),
                fileName: fileName
            }
            attachments.value.push(fileObj)
        }
    }

    const removeFile = (file) => {
        attachments.value = attachments.value.filter(el => el != file)
        removedAttachments.value.push(file)
    }

    const confirmDeleteFile = () => {
        removedAttachments.value.forEach(file => {
            attachmentApi.deleteFile(file.fileName)
        })
    }


    const addedFiles = ref([])
    const uploadAFile = async (file, prefix, refId, refType) => {
        let res = await attachmentApi.uploadFile(file, prefix, refId, refType)
    }
    const uploadAll = async (prefix, refId, refType) => {
        addedFiles.value.forEach(file => {
            uploadAFile(file, prefix, refId, refType)
        }); 
    }

    return { attachments, getFileKey, removeFile, confirmDeleteFile, 
        addedFiles, uploadAll }
}