import {useEffect, useState} from 'react';

type Paper = {
    code: string;
    paperName: string;
};

type Component = {
    papers: Paper[];
    // add other fields if needed
};

export function getJson(): Promise<Component[]> {
    return fetch('components.json')
        .then((response) => response.json())
        .then((json) => {
            return json as Component[];
        });
}

export function getPaperNames() : {[key: string]: string} {
    const paperNames: {[key: string]: string} = {};
    getJson().then((json) => {
        if (json && Array.isArray(json)) {
            json.forEach((component) => {
                component.papers.forEach((paper) => {
                    paperNames[paper.code] = paper.paperName;
                });
            });
        }
    });
    console.log("Paper names: " + JSON.stringify(paperNames));
    return paperNames;
}