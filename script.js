//            ----------Global Selectors----------
const MAX_CHARS = 150;
const BASE_API_URL = "https://bytegrad.com/course-assets/js/1/api";

const textareaEl = document.querySelector(".form__textarea");
const counterEl = document.querySelector(".counter");
const formEl = document.querySelector(".form");
const feedbackListEl = document.querySelector(".feedbacks");
const submitBtnEl = document.querySelector(".submit-btn");
const spinnerEl = document.querySelector(".spinner");
const hashtagListEl = document.querySelector(".hashtags");

const renderFeedbackItem = (feedbackItem) => {
  // new feedback item HTML
  const feedbackItemHTML = `
  <li class="feedback">
    <button class="upvote">
        <i class="fa-solid fa-caret-up upvote__icon"></i>
        <span class="upvote__count">${feedbackItem.upvoteCount}</span>
    </button>
    <section class="feedback__badge">
        <p class="feedback__letter">${feedbackItem.badgeLetter}</p>
    </section>
    <div class="feedback__content">
        <p class="feedback__company">${feedbackItem.company}</p>
        <p class="feedback__text">${feedbackItem.text}</p>
    </div>
    <p class="feedback__date">${
      feedbackItem.daysAgo === 0 ? "NEW" : `${feedbackItem.daysAgo}d`
    }</p>
  </li>
  `;
  //append new feedback item to list
  feedbackListEl.insertAdjacentHTML("beforeend", feedbackItemHTML);
};

//            ---------Counter Component---------

(() => {
  const inputHandler = () => {
    //determine max # of chars
    const maxNumChars = MAX_CHARS; //also implemented in the html file
    //determine # of chars currently typed
    const numCharsTyped = textareaEl.value.length;
    //calculate the num of chars left
    const charsLeft = maxNumChars - numCharsTyped;
    counterEl.textContent = charsLeft;
  };
  textareaEl.addEventListener("input", inputHandler);
})();

//            ----------Form Component----------
(() => {
  const showVisualIndicator = (textCheck) => {
    const className = textCheck === "valid" ? "form--valid" : "form--invalid";
    //show visual valid indicator
    formEl.classList.add(className);
    //remove visual valid indicator
    setTimeout(() => {
      formEl.classList.remove(className);
    }, 2000);
  };
  const submitHandler = (event) => {
    // prevent default browser action
    // (submitting form data to the 'action'-address and refreshing page)
    event.preventDefault();
    //get text from textarea
    const text = textareaEl.value;
    //validate text (e.g. check if #hashtag is present and text is long enough)
    if (text.includes("#") && text.length > 4) {
      showVisualIndicator("valid");
    } else {
      showVisualIndicator("invalid");
      // focus textarea
      textareaEl.focus();
      //stop this function execution
      return;
    }
    //we have text, now extract other info from text
    const hashtag = text.split(" ").find((word) => word.includes("#"));
    const company = hashtag.substring(1);
    const badgeLetter = company.substring(0, 1).toUpperCase();
    console.log(badgeLetter);
    const upvoteCount = 0;
    const daysAgo = 0;
    //render feedback item in list
    const feedbackItem = {
      company: company,
      badgeLetter: badgeLetter,
      upvoteCount: upvoteCount,
      daysAgo: daysAgo,
      text: text,
    };
    renderFeedbackItem(feedbackItem);
    // send feedback item to server
    fetch(`${BASE_API_URL}/feedbacks`, {
      method: "POST",
      body: JSON.stringify(feedbackItem),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        //guard clause: check if something went wrong first, then continue
        if (!response.ok) {
          console.log("Something went wrong");
          return;
        }
        console.log("Successfully submitted");
      })
      .catch((error) => console.log(error)); //arrow function automatically acts as a return
    // clear textarea
    textareaEl.value = "";
    // blur submit button
    submitBtnEl.blur();
    // reset counter
    counterEl.textContent = MAX_CHARS;
  };
  //event listenter: on submit, do this
  formEl.addEventListener("submit", submitHandler);
})();

//            ----------FEEDBACK LIST COMPONENT AJAX PROGRAMMING----------
(() => {
  const clickHandler = (event) => {
    //get clicked HTML element
    const clickedEl = event.target;
    //determine if user intended to upvote or expand
    const upvoteIntention = clickedEl.className.includes("upvote"); //boolean

    // run the appropriate logic
    if (upvoteIntention) {
      // get the closest upvote button
      const upvoteBtnEl = clickedEl.closest(".upvote");
      //disable the upvote button
      upvoteBtnEl.disabled = true; //added in html 'disabled' attr. - css: set hidden
      // select the upvote count element within the upvote button
      // select the CLOSEST!
      const upvoteCountEl = upvoteBtnEl.querySelector(".upvote__count");
      //get currently displayed upvote count
      let upvoteCount = +upvoteCountEl.textContent; //add '+' to convert to num

      //display the new upvote count and increment by 1 w/ '++' BEFORE
      upvoteCountEl.textContent = ++upvoteCount;
    } else {
      //expand the clicked feedback item
      clickedEl.closest(".feedback").classList.toggle("feedback--expand");
    }
  };
  //event listener HAS TO GO AFTER THE HANDLER FUNCTION
  feedbackListEl.addEventListener("click", clickHandler);
  fetch(`${BASE_API_URL}/feedbacks`) //network GET request--ASYNCHRONOUS--Promise
    .then(
      (response) => response.json() //promise, as well; not right now because we are receiving it bit by bit
    )
    .then((data) => {
      //Remove loading spinner
      spinnerEl.remove();
      // here we have all the data
      // iterate over each element in feedbacks array and render it in list
      data.feedbacks.forEach((feedbackItem) => {
        // we created an object 'feedbackItem' that we can enter into the 'renderFeedbackItem()' function to loop through
        renderFeedbackItem(feedbackItem);
      });
      // data.feedbacks.forEach(feedbackItem => renderFeedbackItem(feedbackItem));
    })
    //don't forget to insert which array => data.feedbacks
    .catch((error) => {
      feedbackListEl.textContent = `Failed to fetch feedback items. Error Message: ${error.message}`;
    });
})();
// --------- HASHTAG LIST COMPONENT ---------
(() => {
  const clickHandler = (event) => {
    const clickedEl = event.target;
    //stop function if click happened in list, but outside button
    if (clickedEl.className === "hashtags") return;
    //extract company name from clicked button
    const companyNameFromHashtag = clickedEl.textContent
      .substring(1)
      .toLowerCase()
      .trim();
    //iterate over each feedback item in the list
    //this is an HTML element, so we can't iterate with forEach!
    // instead we have to get the CHILD NODES, which we can perform forEach
    feedbackListEl.childNodes.forEach((childNode) => {
      // go over each one and get each one's company name that was clicked
      //stop this iteration if it's a text node
      if (childNode.nodeType === 3) return;
      // extract company name from that 'li'
      const companyNameFromFeedbackItem = childNode
        .querySelector(".feedback__company")
        .textContent.toLowerCase()
        .trim();
      // remove all feedback items from list if company names are not equal
      if (companyNameFromHashtag !== companyNameFromFeedbackItem) {
        childNode.remove();
      }
    });
  };
  hashtagListEl.addEventListener("click", clickHandler);
})();
