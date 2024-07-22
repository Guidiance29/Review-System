const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const reviewsFilePath = path.join(__dirname, 'reviews.json');

// Create the file if it doesn't exist
if (!fs.existsSync(reviewsFilePath)) {
    fs.writeFileSync(reviewsFilePath, '[]');
}

app.post('/submit-review', (req, res) => {
    const { name, review, rating, imageUrl } = req.body;

    if (!name || !review || !rating) {
        return res.status(400).send('All fields are required');
    }

    const newReview = { name, review, rating, imageUrl };

    fs.readFile(reviewsFilePath, (err, data) => {
        if (err) {
            console.error('Error reading reviews file:', err);
            return res.status(500).send('Server error');
        }

        let reviews = [];
        if (data.length > 0) {
            reviews = JSON.parse(data);
        }

        reviews.push(newReview);

        fs.writeFile(reviewsFilePath, JSON.stringify(reviews, null, 2), (err) => {
            if (err) {
                console.error('Error writing to reviews file:', err);
                return res.status(500).send('Server error');
            }

            res.status(200).send('Review submitted successfully');
        });
    });
});

app.get('/reviews', (req, res) => {
    fs.readFile(reviewsFilePath, (err, data) => {
        if (err) {
            console.error('Error reading reviews file:', err);
            return res.status(500).send('Server error');
        }

        res.status(200).send(data);
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
