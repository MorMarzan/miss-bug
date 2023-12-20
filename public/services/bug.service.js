
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
    return axios.get(BASE_URL, { params: { ...filterBy, sortBy, sortDir } }).then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId).then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId).then(res => res.data)
}

function save(bug) {
    if (bug._id) {
        return axios.put(BASE_URL, bug).then(res => res.data)
    }
    return axios.post(BASE_URL, bug).then(res => res.data)
}

function getDefaultFilter() {
    return { txt: '', minSeverity: '', createdAt: '', label: '', pageIdx: 0 }
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
