    //global variables for pop-up & movie.
    let globalMovieTitle;
    let globalMovieId;
    let globalStarRating;
    let globalReviewText;

    async function addReviewModal(movieTitle, movieId) {
      // Set global variables
      globalMovieTitle = movieTitle;
      globalMovieId = movieId;
      openRatingModal();
    }

    function openRatingModal() {
      // Set the movie name
      document.getElementById('movieName').textContent = globalMovieTitle;

      // Generate stars
      let starRatingDiv = document.getElementById('starRating');
      starRatingDiv.innerHTML = '';

      // Add half star
      starRatingDiv.innerHTML += `
      <input type="radio" id="starHalf" name="rating" value="0.5" />
      <label id="half" for="starHalf" class="half"></label>`;
      // Add 6 full stars
      for (let i = 6; i >= 1; i--) {
        starRatingDiv.innerHTML += `
      <input type="radio" id="star${i}" name="rating" value="${i}" />
      <label id="label${i}" for="star${i}"></label>`;
      }

      // Add event listener to enable submit button
      starRatingDiv.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', () => {
          // set submit review to call submitReview function
          globalStarRating = (input.value == .5) ? 6.5 : input.value;
          document.getElementById('submitReview').disabled = false;
          document.getElementById('submitReview').addEventListener('click', function(){
            globalReviewText = document.getElementById('reviewText').value;
            document.getElementById('submitReview').disabled = true;
            document.getElementById('reviewText').value = " ";
            submitReview();
            modal.hide();
          });
        });
      });

      // Show modal
      var modal = new bootstrap.Modal(document.getElementById('movieRatingModal'));
      modal.show();
    }

    let movieInput = document.getElementById('movieSearch');
    let searchTimeout = false;
    async function search(){
      if(movieInput.value.length  < 3) return;
      if(searchTimeout) return; 
      let input = movieInput.value;
      let query = await fetch(`/search?movieName=${input}`);
      searchTimeout = true; // Prevents search from being called again
      let result = await query.json();
      console.log(result);
      if(result.movies.length != 0 ){
        document.getElementById('movieResults').innerHTML = '';
        result.movies.forEach(movie => {
          document.getElementById('movieResults').innerHTML += `
          <div class="movie-row">
            <div class="movie-title">${movie.title}</div>
            <div class="movie-actions">
              <button class="btn btn-outline-info" onclick='addReviewModal("${movie.title = movie.title.replace(/'/g, '&apos;')}",${movie.movieid})'>Add a review</button>
              <button type="submit" class="btn btn-outline-dark"><a href="/movie/${movie.movieid}" style="color: inherit; text-decoration: none;">View Details</a></button>
            </div>
          </div>`;
        });
      } else {
        document.getElementById('movieResults').innerHTML = `<p class="text-center">No results for ${movieInput.value} found.</p>`;
      }
      //this is a little weird, but it prevents the search from being called again for 3 seconds
      //it will also research if input changes during that time to avoid a weird feeling
      setTimeout(() => {
        searchTimeout = false;//allow search again
        if(input != movieInput.value) search(); //if the input has changed, search again
      }, 3000);
    }

    function submitReview() {
      console.log(globalStarRating);
      console.log(globalMovieId);
      console.log(globalReviewText);
	    let object = {review: globalReviewText, rating: globalStarRating, id: globalMovieId};
	    fetch("/addReview", {method: "POST", body: JSON.stringify(object), headers: {"Content-Type": "application/json" } });
    }