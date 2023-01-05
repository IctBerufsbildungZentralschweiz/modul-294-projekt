export const feedback = (attrs) => ({
    id: 1,
    title: 'Title',
    text: 'Text',
    category: 'Bug',
    votes: 4,
    comments: [
        { text: 'Comment 1', author: 'Author 1' },
    ],
    ...attrs,
})
