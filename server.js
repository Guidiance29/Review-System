const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const reviewsFilePath = path.join(__dirname, 'reviews.json');

// Ensure the reviews.json file exists
if (!fs.existsSync(reviewsFilePath)) {
    fs.writeFileSync(reviewsFilePath, '[]', 'utf-8');
}

app.post('/submit-review', (req, res) => {
    const { name, review, rating, imageUrl } = req.body;

    if (!name || !review || !rating) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const newReview = { name, review, rating, imageUrl };

    fs.readFile(reviewsFilePath, (err, data) => {
        if (err) {
            console.error('Error reading reviews file:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        let reviews = [];
        if (data.length > 0) {
            reviews = JSON.parse(data);
        }

        reviews.push(newReview);

        fs.writeFile(reviewsFilePath, JSON.stringify(reviews, null, 2), (err) => {
            if (err) {
                console.error('Error writing to reviews file:', err);
                return res.status(500).json({ message: 'Server error' });
            }

            return res.status(200).json({ message: 'Review submitted successfully' });
        });
    });
});

app.get('/reviews', (req, res) => {
    fs.readFile(reviewsFilePath, (err, data) => {
        if (err) {
            console.error('Error reading reviews file:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        res.status(200).json(JSON.parse(data));
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
