import app from './app';

const PORT = process.env.PORT || 9100;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
