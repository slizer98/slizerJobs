const seleccionarSkills = (seleccionadas = [], opciones) => {
    const skills = [
        'HTML5',
        'CSS3',
        'CSS Grid',
        'CSS Flexbox',
        'CSS Frameworks',
        'SASS',
        'LESS',
        'JavaScript',
        'TypeScript',
        'jQuery',
        'NodeJS',
        'ReactJS',
        'React Hooks',
        'React Router',
        'Redux',
        'NextJS',
        'GatsbyJS',
        'SvelteJS',
        'Apollo',
        'GraphQL',
        'VueJS',
        'AngularJS',
        'PHP',
        'Laravel',
        'Python',
        'Django',
        'Ruby',
        'Ruby on Rails',
        'Java',
        'C#',
        'C++',
        'Swift',
        'Objective-C',
        'Go',
        'SQL',
        'NoSQL',
        'WordPress',
        'Drupal',
        'Magento',
        'Prestashop',
        'Shopify',
        'Git',
        'GitHub',
        'BitBucket',
        'GitLab',
        'Docker',
        'Linux',
        'Nginx',
        'Apache',
        'Firebase',
        'Heroku',
        'Netlify',
        'Vercel',
        'AWS',
        'Google Cloud',
        'Azure',
        'Digital Ocean',
        'Vultr',
        'Linode',
        'Cloudflare',
        'Cloudinary',
        'PayPal',
        'Stripe',
        'MercadoPago',
        'PayU',
    ];
    let html = '';
    skills.forEach(skill => {
        html += `
            <li>${skill}</li>
        `;
    });
    return html;
}

export default seleccionarSkills;