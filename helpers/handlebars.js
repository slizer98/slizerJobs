export const  seleccionarSkills = (seleccionadas = [], opciones) => {
   
    const skills = [  
        'AngularJS',  
        'Apache',  
        'Apollo',  
        'AWS',  
        'Azure',  
        'BitBucket',  
        'C',
        'C#',  
        'C++',  
        'CSS3',  
        'CSS Flexbox',  
        'CSS Frameworks',  
        'CSS Grid', 
        'Cloudflare',  
        'Cloudinary',  
        'Django',  
        'Docker',  
        'Drupal',  
        'Firebase',
        'Flutter',  
        'Git',  
        'GitHub',  
        'GitLab',  
        'Go',  
        'GraphQL',  
        'GatsbyJS',  
        'HTML5',  
        'Heroku',  
        'Java',  
        'JavaScript',  
        'jQuery',  
        'JSON',
        'Jest',
        'kotlin',
        'Laravel',  
        'Less',  
        'Linux',  
        'Linode',  
        'Magento',  
        'MercadoPago',
        'MongoDB',
        'Moongoose',
        'MySQL',
        'Netlify',  
        'NextJS',  
        'Nginx',  
        'NoSQL',  
        'NodeJS',  
        'Objective-C',  
        'PHP',  
        'PayPal',  
        'PayU',  
        'Prestashop',  
        'Python',  
        'React Hooks',  
        'React Router',  
        'ReactJS',  
        'Redux',  
        'Ruby',  
        'Ruby on Rails', 
        'Rust', 
        'SASS',
        'SCSS',
        'Solidity',  
        'SQL',  
        'SvelteJS',  
        'Stripe',
        'Swift',  
        'TypeScript', 
        'Unity', 
        'Vercel',  
        'VueJS',  
        'Vultr',  
        'WordPress',   
        'Xamarin'
    ];

    
    let html = '';
    skills.forEach(skill => {
        html += `
            <li class="${seleccionadas.includes(skill) ? 'activo' : '' }">${skill}</li>
        `;
    });
    return html;
}


// exportar la funcion tipoContrato
export const tipoContrato = (seleccionado, opciones) => {
    return opciones.fn(this).replace(
        new RegExp(` value="${seleccionado}"`), '$& selected="selected"'
    );
}

export const mostrarAlertas = (errores = {}, alertas) => {
    const categoria = Object.keys(errores);
    
    let html = '';

    if(categoria.length){
        errores[categoria].forEach(error => {
            html += `
                <div class="${categoria} alerta">
                    ${error}
                </div>`;
        });
    }
    return html;
}