// Remove all your non-mutual followers on Twitter/X
// ** Non-mutual followers are followers that you don't follow back. **
// 
// 1. Go to https://x.com/YOUR_USER_NAME/followers
// 2. Open the Developer Console (COMMAND+OPTION+J on Mac, CONTROL+SHIFT+J on Windows)
// 3. Paste the code into the Developer Console and run it
//
// If you start seeing error messages in the console with the code
// "429," this means Twitter is rate-limiting you. Stop the script
// (i.e., reload or close the browser tab), and try again later.
// 
// Adapted from: Remove everyone following you on twitter.com, by Ben Ramsey (https://github.com/ramsey)
// https://gist.github.com/ramsey/bdeefda66d6e2294d3466edcea30187b
// 
// Last Updated: 16 November 2024


(() => {
  let total = 0;
  
  const $moreButton = '[aria-label="More"]';
  const $removeFollowerButton = '[data-testid="removeFollower"]';
  const $confirmButton = '[data-testid="confirmationSheetConfirm"]';

  const retry = {
    count: 0,
    limit: 3,
  };

  const scrollToTheBottom = () => window.scrollTo(0, document.body.scrollHeight);
  const retryLimitReached = () => retry.count === retry.limit;
  const addNewRetry = () => retry.count++;

  const sleep = ({ seconds }) => {
    return new Promise((proceed) => {
      setTimeout(proceed, seconds * 1000);
    });
  };

  const remove = async (followerEl) => {
    const element = followerEl.querySelector('[aria-label^="Follow "]');
    if (element) {
      const username = element.getAttribute("aria-label").split("Follow ").pop();
      console.log(`Unfollow ${username}`);

      const moreButton = followerEl.querySelector($moreButton);
      if (moreButton) {
        moreButton.click();
        await sleep({ seconds: 0.5 });

        const removeFollowerButton = document.querySelector($removeFollowerButton);
        if (removeFollowerButton) {
          removeFollowerButton.click();
          await sleep({ seconds: 0.5 });

          const confirmButton = document.querySelector($confirmButton);
          if (confirmButton) {
            confirmButton.click();
            await sleep({ seconds: 0.5 });

            total++;

            if (total % 100 === 0) {
              console.log(`------- ${total} FOLLOWERS REMOVED -------`);
            }
          }
        } else {
          console.log("Remove follower button not found, skipping...");
        }
      } else {
        console.log("More button not found, skipping...");
      }
    }
  };

  const nextBatch = async () => {
    const followersListEl = document.querySelector('[aria-label="Timeline: Followers"]');
    const followersEls = followersListEl ? followersListEl.querySelectorAll('[data-testid="UserCell"]') : [];
    const moreFollowersFound = followersEls.length > 0;

    if (moreFollowersFound) {
      const removalPromises = [];
      for (const followerEl of followersEls) {
        removalPromises.push(remove(followerEl));
      }

      await Promise.all(removalPromises);
      
      scrollToTheBottom();
      await sleep({ seconds: 1 });
      return nextBatch();
    } else {
      addNewRetry();
    }

    if (retryLimitReached()) {
      console.log(`NO FOLLOWERS FOUND, SO I THINK WE'RE DONE`);
      console.log(`RELOAD PAGE AND RE-RUN SCRIPT IF ANY WERE MISSED`);
    } else {
      scrollToTheBottom();
      await sleep({ seconds: 1 });
      return nextBatch();
    }
  };

  nextBatch();  // Start processing the first batch
})();
