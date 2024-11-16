(() => {
  const $moreButtons = '[aria-label="More"]';
  const $removeFollowerButton = '[data-testid="removeFollower"]';
  const $confirmButton = '[data-testid="confirmationSheetConfirm"]';

  const retry = {
    count: 0,
    limit: 3,
  };

  const followersListEl = document.querySelector('[aria-label="Timeline: Followers"]');

  const followersEls = followersListEl.querySelectorAll('[data-testid="UserCell"]');
  
  followersEls.forEach(followerEl => {
    element = followerEl.querySelector('[aria-label^="Follow "]');
  
    if (element) {
      username = element.getAttribute("aria-label").split("Follow ").pop();
  
      console.log(`Unfollow ${username}`);
    } else {
      console.log(`Do not unfollow`)
    }
  })
})();
