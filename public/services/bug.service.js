
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getBugsPDF
}


function query(filterBy, sortBy = 'severity', sortDir = 1) {
    // console.log('sortDir server public', sortDir)
    //server side filtering - good for big data!
    return axios.get(BASE_URL, { params: { ...filterBy, sortBy, sortDir } }).then(res => res.data)
}

function getById(bugId) {
    // console.log('hey from getById service front')
    return axios.get(BASE_URL + bugId).then(res => res.data)
}

function remove(bugId) {
    // console.log('hey from remove service front')
    return axios.delete(BASE_URL + bugId).then(res => res.data)
}

function save(bug) {
    if (bug._id) {
        // console.log('hey from update-save service front')
        return axios.put(BASE_URL, bug).then(res => res.data)
    }
    // console.log('hey from create-save service front')
    return axios.post(BASE_URL, bug).then(res => res.data)
}

function getDefaultFilter() {
    return { txt: '', minSeverity: '', createdAt: '', label: '' }
}

function getBugsPDF() {
    return axios.get(BASE_URL + 'download')
        .then((fileName) => {
            console.log('fileName', fileName)
            return fileName.data
        })
}

function _createBugs() {
    let bugs = utilService.loadFromStorage(STORAGE_KEY)
    if (!bugs || !bugs.length) {
        bugs = [
            {
                title: "Infinite Loop Detected",
                description: "test",
                severity: 4,
                _id: "1NF1N1T3"
            },
            {
                title: "Keyboard Not Found",
                description: "test",
                severity: 3,
                _id: "K3YB0RD"
            },
            {
                title: "404 Coffee Not Found",
                description: "test",
                severity: 2,
                _id: "C0FF33"
            },
            {
                title: "Unexpected Response",
                description: "test",
                severity: 1,
                _id: "G0053"
            }
        ]
        utilService.saveToStorage(STORAGE_KEY, bugs)
    }



}
