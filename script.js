// --Global Selectors--
const MAX_CHARS = 150;

const textareaEl = document.querySelector(".form__textarea");
const counterEl = document.querySelector(".counter");
const formEl = document.querySelector(".form");
const feedbackListEl = document.querySelector(".feedbacks");
const submitBtnEl = document.querySelector(".submit-btn");

// --Counter Component--
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

// --Form Component--

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

  // new feedback item HTML
  const feedbackItemHTML = `
  <li class="feedback">
    <button class="upvote">
        <i class="fa-solid fa-caret-up upvote__icon"></i>
        <span class="upvote__count">${upvoteCount}</span>
    </button>
    <section class="feedback__badge">
        <p class="feedback__letter">${badgeLetter}</p>
    </section>
    <div class="feedback__content">
        <p class="feedback__company">${company}</p>
        <p class="feedback__text">${text}</p>
    </div>
    <p class="feedback__date">${daysAgo === 0 ? "NEW" : `${daysAgo}d`}</p>
</li>
`;
  //append new feedback item to list
  feedbackListEl.insertAdjacentHTML("beforeend", feedbackItemHTML);
  // clear textarea
  textareaEl.value = "";
  // blur submit button
  submitBtnEl.blur();
  // reset counter
  counterEl.textContent = MAX_CHARS;
};

formEl.addEventListener("submit", submitHandler);

// --FEEDBACK LIST COMPONENT AJAX PROGRAMMING
fetch("https://bytegrad.com/course-assets/js/1/api/feedbacks") //network GET request--ASYNCHRONOUS--Promise
  .then(
    (response) => response.json() //promise, as well; not right now because we are receiving it bit by bit
  )
  .then((data) => {
    // here we have all the data
    // iterate over each element in feedbacks array and render it in list
    data.feedbacks.forEach((feedbackItem) => {
      //don't forget to insert which array => data.feedbacks
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
        <p class="feedback__company">${feedbackItem.company}}</p>
        <p class="feedback__text">${feedbackItem.text}</p>
    </div>
    <p class="feedback__date">${
      feedbackItem.upvoteCount === 0 ? "NEW" : `${feedbackItem.daysAgo}d`
    }</p>
  </li>
  `;
      //append new feedback item to list
      feedbackListEl.insertAdjacentHTML("beforeend", feedbackItemHTML);
    });
  })
  .catch((error) => {});
