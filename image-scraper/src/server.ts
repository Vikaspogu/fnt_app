import app from './app';
const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
    console.log(`🚀 started on port ${PORT}`)
});
