
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const BASE_URL = '/api/bug/'
// const STORAGE_KEY = 'bugDB'
// _createBugs()

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getBugsPDF
}


function query(filterBy) {
    return axios.get(BASE_URL).then(res => res.data)
        .then(bugs => {
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title) || regExp.test(bug.description))
            }
            if (filterBy.minSeverity) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
            }
            return bugs
        })
}
function getById(bugId) {
    return axios.get(BASE_URL + bugId).then(res => res.data)
    // return storageService.get(STORAGE_KEY, bugId)
}

function remove(bugId) {
    return axios.get(BASE_URL + bugId + '/remove')
    // return storageService.remove(STORAGE_KEY, bugId)
}

function save(bug) {
    const url = BASE_URL + 'save'
    let queryParams = `?title=${bug.title}&description=${bug.description}&severity=${bug.severity}`
    if (bug._id) {
        queryParams += `&_id=${bug._id}`
    }
    return axios.get(url + queryParams).then((res) => res.data)
    // if (bug._id) {
    //     return storageService.put(STORAGE_KEY, bug)
    // } else {
    //     return storageService.post(STORAGE_KEY, bug)
    // }
}

function getDefaultFilter() {
    return { txt: '', minSeverity: '', createdAt: '' }
}

function getBugsPDF() {
    return axios.get(BASE_URL + 'download')
        .then((fileName) => {
            console.log('fileName',fileName)
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
