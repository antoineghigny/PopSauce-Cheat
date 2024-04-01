// ==UserScript==
// @name         Pop sauce Revealer
// @version      0.1
// @description  Pop sauce Revealer
// @match        *://*.jklm.fun/*
// ==/UserScript==

const API_BASE_URL = "http://localhost:8081";
const CHECK_ENDPOINT = "/check/";
const POST_ENDPOINT = "/";
const MONITOR_INTERVAL = 3000;
const QUERY_SELECTORS = {
    challenge: '.challenge',
    question: '.prompt',
    imageWrapper: '.image',
    textWrapper: '.textScroll',
    answerWrapper: '.challengeResult',
    input: '.round.guessing input'
};

const GREEN_BACKGROUND = "background: #85D492; color: #000";
const RED_BACKGROUND = "background: #D68280; color: #000";
const BLUE_BACKGROUND = "background: #80A5D6; color: #000";

const hashCode = (str) => [...str].reduce((hash, char) => Math.imul(31, hash) + char.charCodeAt(0) | 0, 0);

const fetchJSON = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            if (response.status === 404) {
                // Silently handle 404 errors
                return { exists: false };
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error.message);
        return { error: true };
    }
};


const answerRevealObserver = new MutationObserver((mutations, obs) => {
    const inputElement = document.querySelector(QUERY_SELECTORS.input);
    if (inputElement && !document.querySelector(QUERY_SELECTORS.answerWrapper).hidden) {
        inputElement.placeholder = '';
        obs.disconnect();
    }
});

const postAnswer = async (hash, answer) => {
    try {
        await fetchJSON(API_BASE_URL + POST_ENDPOINT, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ key: hash, value: answer })
        });
    } catch (error) {
        console.error('Error posting answer:', error);
    }
};

const extractText = (element, selector) => element.querySelector(selector)?.innerText || '';

const generateHash = (content) => hashCode(content);

const hashImageContent = async (imageElement, additionalText = '') => {
    const imageUrl = imageElement.style.backgroundImage.slice(5, -2);
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(generateHash(additionalText + reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const processChallengeContent = async (elements, state) => {
    const { question, imageWrapper, textWrapper, answerWrapper } = elements;
    if (!answerWrapper.hidden && !state.answerRevealed) {
        state.answerRevealed = true;
        const answerContent = extractText(answerWrapper, '.value');
        const contentHash = imageWrapper.hidden
        ? generateHash(question + extractText(textWrapper, '.text'))
        : await hashImageContent(imageWrapper.querySelector('.actual'), question);

        const checkResponse = await fetchJSON(API_BASE_URL + CHECK_ENDPOINT + contentHash);
        if (!checkResponse.exists && !checkResponse.error) {
            await postAnswer(contentHash, answerContent);
            console.log(`%c[Pop Sauce Hack] New answer recorded for question: '${question}'`, RED_BACKGROUND);
        } else if (checkResponse.exists) {
            console.log(`%c[Pop Sauce Hack] Answer for question '${question}' already in database: '${checkResponse.value}'`, GREEN_BACKGROUND);
        }
    } else if (answerWrapper.hidden) {
        state.answerRevealed = false;
    }
};

const monitorChallenge = () => {
    const state = { answerRevealed: false };
    setInterval(async () => {
        const challengeElements = {
            challenge: document.querySelector(QUERY_SELECTORS.challenge),
            question: extractText(document, QUERY_SELECTORS.question),
            imageWrapper: document.querySelector(QUERY_SELECTORS.imageWrapper),
            textWrapper: document.querySelector(QUERY_SELECTORS.textWrapper),
            answerWrapper: document.querySelector(QUERY_SELECTORS.answerWrapper)
        };

        if (challengeElements.challenge) {
            await processChallengeContent(challengeElements, state);
        }
    }, MONITOR_INTERVAL);
};

const handleInputEvent = async (event) => {
    const { target: inputElement } = event;
    if (inputElement.value.includes('+')) {
        const { question, imageWrapper, textWrapper } = {
            question: extractText(document, QUERY_SELECTORS.question),
            imageWrapper: document.querySelector(QUERY_SELECTORS.imageWrapper),
            textWrapper: document.querySelector(QUERY_SELECTORS.textWrapper)
        };

        const contentHash = imageWrapper.hidden
        ? generateHash(question + extractText(textWrapper, '.text'))
        : await hashImageContent(imageWrapper.querySelector('.actual'), question);

        answerRevealObserver.observe(document.querySelector(QUERY_SELECTORS.answerWrapper), { attributes: true });
        inputElement.value = '';
        try {
            const data = await fetchJSON(API_BASE_URL + CHECK_ENDPOINT + contentHash);
            if (data.exists) {
                inputElement.placeholder = data.value;
                console.log(`%c[Pop Sauce Hack] Found answer for question '${question}': '${data.value}'`, GREEN_BACKGROUND);
            } else {
                inputElement.placeholder = 'This will be recorded...';
                console.log(`%c[Pop Sauce Hack] No answer found for question '${question}': '${data.value}'. This will be recorded.`, RED_BACKGROUND);
            }
        } catch (error) {
            console.error(`[Pop Sauce Hack] Error checking answer for question '${question}': '${data.value}':`, error);
            inputElement.placeholder = 'Error checking answer';
        }
    }
};

(() => {
    console.log('[Pop Sauce Hack] Script initiated');
    monitorChallenge();

    setTimeout(() => {
        const input = document.querySelector(QUERY_SELECTORS.input);
        if (input) {
            console.log('%cPress "+" to reveal the answer', BLUE_BACKGROUND);
            input.addEventListener('input', handleInputEvent);
        }
    }, MONITOR_INTERVAL);
})();