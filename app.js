// Threshold for deciding whether the card should be swiped left or right
const DECISION_THRESHOLD = 75;

// Variables to track animation state and dragging distance
let isAnimating = false;
let pullDeltaX = 0; // distance from the card being dragged

// New variables to track the number of cards dragged and removed
let cardsDragged = 0;
let cardsRemoved = 0;

// Get the card container
const cardContainer = document.querySelector('.card-container');

// Function to start the drag event
function startDrag(event) {
  // Prevent drag event if currently animating
  if (isAnimating) return;

  // Get the card being dragged
  const actualCard = event.target.closest('article');
  if (!actualCard) return;

  // Increment the cards dragged count
  cardsDragged++;

  // Get initial position of mouse or finger
  const startX = event.pageX ?? event.touches[0].pageX;

  // Listen to mouse and touch movements
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);

  document.addEventListener('touchmove', onMove, { passive: true });
  document.addEventListener('touchend', onEnd, { passive: true });

  // Function to handle movement during drag
  function onMove(event) {
    // Current position of mouse or finger
    const currentX = event.pageX ?? event.touches[0].pageX;

    // Calculate the distance between initial and current position
    pullDeltaX = currentX - startX;

    // If no distance traveled in X axis, exit
    if (pullDeltaX === 0) return;

    // Set flag to indicate animation
    isAnimating = true;

    // Calculate rotation of the card based on the distance
    const deg = pullDeltaX / 14;

    // Apply transformation to the card
    actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;

    // Change cursor to grabbing
    actualCard.style.cursor = 'grabbing';

    // Change opacity of the choice info
    const opacity = Math.abs(pullDeltaX) / 100;
    const isRight = pullDeltaX > 0;

    const choiceEl = isRight
      ? actualCard.querySelector('.choice.like')
      : actualCard.querySelector('.choice.nope');

    choiceEl.style.opacity = opacity;
  }

  // Function to handle end of drag
  function onEnd(event) {
    // Remove event listeners
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onEnd);

    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onEnd);

    // Check if user made a decision
    const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD;

    if (decisionMade) {
      const goRight = pullDeltaX >= 0;

      // Add class according to the decision
      actualCard.classList.add(goRight ? 'go-right' : 'go-left');
      actualCard.addEventListener('transitionend', () => {
        actualCard.remove();
        // Increment the cards removed count
        cardsRemoved++;
      });
    } else {
      // Reset card position and opacity
      actualCard.classList.add('reset');
      actualCard.classList.remove('go-right', 'go-left');

      actualCard.querySelectorAll('.choice').forEach(choice => {
        choice.style.opacity = 0;
      });
    }

    // Reset variables after animation
    actualCard.addEventListener('transitionend', () => {
      actualCard.removeAttribute('style');
      actualCard.classList.remove('reset');

      pullDeltaX = 0;
      isAnimating = false;
    });

    // Reset choice info opacity
    actualCard
      .querySelectorAll('.choice')
      .forEach(el => (el.style.opacity = 0));

    // If all cards have been dragged and removed, log a message
    if (cardsDragged === cardsRemoved && cardContainer.children.length === 0) {
      console.log('All cards have been removed!');
    }
  }
}

// Event listeners for mouse and touch start events to initiate drag
document.addEventListener('mousedown', startDrag);
document.addEventListener('touchstart', startDrag, { passive: true });

// Function to handle swiping left
function swipeLeft() {
  console.log('Swiped Left');
}

// Function to handle swiping right
function swipeRight() {
  console.log('Swiped Right');
}

// Function to handle card removal animation
function animateCardRemoval() {
  console.log('Animating Card Removal');
}

// Function to handle card reset animation
function animateCardReset() {
  console.log('Animating Card Reset');
}

// Function to calculate distance between two points
function calculateDistance(point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}