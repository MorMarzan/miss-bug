import fs from 'fs'
import { utilService } from "./utils.service.js";


export const bugService = {
    query,
    getById,
    remove,
    save
}

const bugs = utilService.readJsonFile('data/bug.json')


function query() {
    return Promise.resolve(bugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('bug dosent exist!')

    return Promise.resolve(bug)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(bugIdx, 1)
    return _savebugsToFile()
}

function save(bug) {
    if (bug._id) {
        const bugIdx = bugs.findIndex(currbug => currbug._id === bug._id)
        bugs[bugIdx] = bug
    } else {
        bug.createdAt = Date.now()
        bug._id = utilService.makeId()
        bugs.unshift(bug)
    }

    return _savebugsToFile().then(() => bug)
}


function _savebugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                console.log(err)
                return reject(err)
            }
            resolve()
        })
    })
}