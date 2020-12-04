const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, literal, quad } = DataFactory;
const moment = require('moment');
const bibtexParser = require('bibtex-parse');

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

const exportResources = async(project, prefix, pdfResourcesUri, projectResourcesUri, annotations, user, store) => {
    var seenResources = {};
    annotations.forEach(annotation => {
        const resourceInfo = annotation.resource
        const name = resourceInfo.resourceName.replace(" ", "");
        const type = resourceInfo.type.replace(" ", "");
        const propertyType = resourceInfo.property.label
        const propertyText = annotation.content.text
        var author = ":"+user.name;
        const resourceUri = ":"+name;
        store.addQuad(quad(
            namedNode(resourceUri),
            namedNode("dcterms:creator"),
            namedNode(author)
       ));
        if(propertyType === 'label'){
            store.addQuad(quad(
            namedNode(resourceUri),
            namedNode("rdfs:label"),
            literal(propertyText, project.language.toLowerCase())
            ));
        }
       else if(propertyType === 'description'){
            store.addQuad(quad(
                namedNode(resourceUri),
                namedNode("skos:definition"),
                literal(propertyText, project.language.toLowerCase())
            ));
       }

       if(!seenResources[resourceUri]){
            store.addQuad(quad(
                namedNode(resourceUri),
                namedNode("rdf:type"),
                literal(type, project.language.toLowerCase())
            ));
            store.addQuad(quad(
                namedNode(resourceUri),
                namedNode("prov:hadPrimarySource"),
                namedNode(pdfResourcesUri)
            ));
            seenResources[resourceUri] = true;
        }

        store.addQuad(
            namedNode(resourceUri),
            namedNode('prov:wasDerivedFrom'),
            namedNode(prefix+"#" +annotation._id)
        );
    })

    return Promise.resolve()
}

const createPDFResource = async (pdf, prefix, language, mainpdfUri, store) => {
    var i = 0;
    pdf.forEach(async citation => {
        let pdfUri = mainpdfUri
        if (i > 0){
            pdfUri = prefix + "#" +  String(Math.random()).slice(2)
        }
        for(const attribute in citation){
            if(attribute === 'AUTHOR'){
                const authorString = citation.AUTHOR
                const authors = authorString.split("and");
                authors.forEach(async author => {
                    const authorid = author.split(". ").join("").toLowerCase().replace(/ /g, "").trim()
                    await createAuthorResource(authorid, author.trim(), store);
                    store.addQuad(quad(
                        namedNode(pdfUri),
                        namedNode("dcterms:creator"),
                        namedNode(":"+authorid)
                    ))    
                })
            }
            else if(attribute === 'TITLE'){
                store.addQuad(quad(
                    namedNode(pdfUri),
                    namedNode("dcterms:title"),
                    literal(citation.TITLE, language)
                ))
            }
            else if(attribute === 'PAGES'){
                multiplePagesIndex = citation.PAGES.search("--")
                if(multiplePagesIndex != -1){
                    const pageStart = citation.PAGES.slice(0, multiplePagesIndex);
                    const pageEnd = citation.PAGES.slice(multiplePagesIndex + 2);
                    store.addQuad(quad(
                        namedNode(pdfUri),
                        namedNode("bibo:pageStart"),
                        literal(pageStart)
                    ))
                    store.addQuad(quad(
                        namedNode(pdfUri),
                        namedNode("bibo:pageEnd"),
                        literal(pageEnd)
                    ))
                }else{
                    store.addQuad(quad(
                        namedNode(pdfUri),
                        namedNode("bibo:pages"),
                        literal(citation.PAGES)
                    ))
                }
            }
            else if(attribute === 'VOLUME'){
                store.addQuad(quad(
                    namedNode(pdfUri),
                    namedNode("bibo:volume"),
                    literal(citation.VOLUME)
                ))
            }
            else if(attribute === 'JOURNAL'){
                const journalId = ":j" + String(Math.random()).slice(2)
                store.addQuad(quad(
                    namedNode(journalId),
                    namedNode("dcterms:title"),
                    literal(citation.JOURNAL, language)
                ))
                store.addQuad(quad(
                    namedNode(journalId),
                    namedNode("rdf:type"),
                    namedNode("bibo:Journal")
                ))
                store.addQuad(quad(
                    namedNode(pdfUri),
                    namedNode("dcterms:isPartOf"),
                    namedNode(journalId)
                ))
            }
            else if(attribute === 'YEAR'){
                const year = citation.YEAR
                let month = 1
                let day = 1
                let datetimeString = "YYYY"
                const months = {
                    "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6, "jul": 7,"aug": 8,"sep": 9,"oct": 10,"nov": 11,"dec": 12,
                    "january": 1, "february": 2, "march": 3, "april": 4, "may": 5, "june": 6, "july": 7,"august": 8,"september": 9,"october": 10,"november": 11,"december": 12
                }
                if(citation.MONTH){
                    month = citation.MONTH
                    datetimeString = "YYYY MM"
                    if(!Number.isInteger(month)){
                        month = months[citation.MONTH.toLowerCase()]
                    }else {
                        month = Number.parseInt(month)
                    }
                    if(citation.DAY){
                        datetimeString = "YYYY-MM-DD"
                        day = Number.parseInt(citation.DAY)
                    }
                }
                const dateobject = new Date(Number.parseInt(year), month - 1, day)
                const date = moment(dateobject.toISOString())
                const dateString = date.format(datetimeString)
                store.addQuad(quad(
                    namedNode(pdfUri),
                    namedNode("dcterms:date"),
                    literal(dateString)
                ))   
            }
            else if(attribute === 'PUBLISHER'){
                store.addQuad(quad(
                    namedNode(pdfUri),
                    namedNode("dcterms:publisher"),
                    literal(citation.PUBLISHER)
                ))  
            }
            else if(attribute === 'type'){
                var pdftype = "Article"
                switch(citation.type){
                    case "article":
                        pdftype = "Article"
                        break;
                    case "book":
                        pdftype = "Book"
                        break;
                    case "booklet":
                        pdftype = "Book"
                        break;
                    case "inbook":
                        pdftype = "BookSection"
                        break;
                    case "incollection":
                        pdftype = "BookSection"
                        break;
                    case "inproceedings":
                        pdftype = "BookSection"
                        break;
                    case "proceedings":
                        pdftype = "Proceedings";
                        break;
                    case "manual":
                        pdftype = "Manual"
                        break;
                    case "masterthesis":
                        pdftype = "Thesis"
                        break;
                    case "phdthesis":
                        pdftype = "Thesis"
                        break;
                    case "techreport":
                        pdftype = "Report"
                        break;
                    case "unpublished":
                        pdftype = "Manuscript"
                        break;
                    default:
                        pdftype = "Document"
                }
                store.addQuad(quad(
                    namedNode(pdfUri),
                    namedNode("rdf:type"),
                    namedNode("bibo:" + pdftype)
                ))  
            }
            else if(attribute === 'NUMBER'){
                store.addQuad(quad(namedNode(pdfUri), namedNode("bibo:locator"), literal(citation.NUMBER)))
            } 
            else if(attribute !== 'MONTH' && attribute !== 'DAY' && attribute !== 'key'){
                store.addQuad(quad(
                    namedNode(pdfUri),
                    namedNode("bibo:" + attribute.toLowerCase().toProperCase()),
                    literal(citation[attribute])
                ))  
            }
        }
        i += 1;
    })
    return Promise.resolve();
}

const createProjectResource = async (project, projectResourcesUri, user, store) => {
    store.addQuad(quad(
        namedNode(projectResourcesUri),
        namedNode("dcterms:creator"),
        namedNode(":"+user.name)
    ));
    store.addQuad(quad(
        namedNode(projectResourcesUri),
        namedNode("dcterms:title"),
        literal(project.name, project.language)
    ));
    store.addQuad(quad(
        namedNode(projectResourcesUri),
        namedNode("void:inDataset"),
        namedNode(":datasetdefinition")
    ));
    store.addQuad(quad(
        namedNode(projectResourcesUri),
        namedNode("rdf:type"),
        namedNode("http://purl.org/vocommons/voaf#Vocabulary"),   
    ));
    store.addQuad(quad(
        namedNode(projectResourcesUri),
        namedNode("rdf:type"),
        namedNode("owl:Ontology"),   
    ));
    store.addQuad(quad(
        namedNode(projectResourcesUri),
        namedNode("rdfs:label"),
        literal(project.name, project.language),   
    ));
    store.addQuad(quad(
        namedNode(projectResourcesUri),
        namedNode("foaf:name"),
        literal(project.name, project.language),   
    ));

    return Promise.resolve()
}

const createDatasetResource = async (project, prefix, user, store) => {
    const datasetdefinitionUri = ":datasetdefinition" 
    store.addQuad(quad(
        namedNode(datasetdefinitionUri),
        namedNode("dcterms:creator"),
        namedNode(":"+user.name)
    ));
    store.addQuad(quad(
        namedNode(datasetdefinitionUri),
        namedNode("dcterms:title"),
        literal(project.name, project.language)
    ));
    store.addQuad(quad(
        namedNode(datasetdefinitionUri),
        namedNode("rdf:type"),
        namedNode("void:Dataset")
    ));
    store.addQuad(quad(
        namedNode(datasetdefinitionUri),
        namedNode("rdfs:label"),
        literal(project.name, project.language),   
    ));
    store.addQuad(quad(
        namedNode(datasetdefinitionUri),
        namedNode("foaf:name"),
        literal(project.name, project.language),   
    ));

    return Promise.resolve()
}

const createLocationResource = async (prefix, annotationUri, annotation, store) => {
    const locationid = ":l" + String(Math.random()).slice(2)
    annotation.position.rects.forEach(rect => {
        const rectid = prefix + "/rect#" + rect._id
        store.addQuad(quad(
            namedNode(locationid),
            namedNode(":rects"),
            namedNode(rectid)
        ));
        store.addQuad(quad(
            namedNode(rectid),
            namedNode(":x1"),
            literal(rect.x1)
        ));
        store.addQuad(quad(
            namedNode(rectid),
            namedNode(":y1"),
            literal(rect.y1)
        ));
        store.addQuad(quad(
            namedNode(rectid),
            namedNode(":x2"),
            literal(rect.x2)
        ));
        store.addQuad(quad(
            namedNode(rectid),
            namedNode(":y2"),
            literal(rect.y2)
        ));
        store.addQuad(quad(
            namedNode(annotationUri),
            namedNode(":position"),
            namedNode(locationid)
        ))
    })
}

const createAnnotationResource = async (project, prefix, pdfResourcesUri, annotations, store) => {
    annotations.forEach(element => {
        const id = element._id;
        const text = element.content.text;
        const resourceUri = prefix+"#"+id;  
        store.addQuad(quad(
            namedNode(resourceUri),
            namedNode("nif-core:isString"),
            literal(text)
        ));
        store.addQuad(quad(
            namedNode(resourceUri),
            namedNode("rdf:type"),
            namedNode("nif-core:String")
        ));
        store.addQuad(quad(
            namedNode(resourceUri),
            namedNode("prov:hadPrimarySource"),
            namedNode(pdfResourcesUri)
        ));
        createLocationResource(prefix, resourceUri, element, store);
    });

    return Promise.resolve();
}

const createAuthorResource = async(authorId, authorname, store) => {
    store.addQuad(quad(
        namedNode(":" + authorId),
        namedNode("rdf:type"),
        namedNode("foaf:Person")
    ));
    store.addQuad(quad(
        namedNode(":" + authorId),
        namedNode("foaf:name"),
        literal(authorname)
    ));

    return Promise.resolve();
}

const exportSerialization = async (project, annotations, user) => { 
    let prefix = project.prefix;
    let pdf = bibtexParser.entries(project.bibtex);
    const primarySource = project._id;
    const store = new N3.Store({ prefixes: 
        {   //Prefixes goes here
            
            rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            "": project.prefix,
            bibo: 'http://purl.org/ontology/bibo/',
            dcterms: 'http://purl.org/dc/terms/',
            foaf: 'http://xmlns.com/foaf/0.1/',
            "nif-core": 'http://persistence.uni-leipzig.org/nlp2rdf/ontologies/nif-core#',
            owl: 'http://www.w3.org/2002/07/owl#',
            prov: 'http://www.w3.org/ns/prov#',
            rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
            skos: 'http://www.w3.org/2004/02/skos/core#',
            skosxl: 'http://www.w3.org/2008/05/skos-xl#',
            void: 'http://rdfs.org/ns/void#',
        }, 
    });
    const pdfResourcesUri = prefix + "#" + "00000";
    const projectResourcesUri = prefix + "#" + primarySource;
    //Project Resource
    await createProjectResource(project, projectResourcesUri, user, store);
    if(pdf.length > 0){
        await createPDFResource(pdf, prefix, project.language, pdfResourcesUri, store);
    }else{
        store.addQuad(quad(
            namedNode(pdfResourcesUri),
            namedNode("dcterms:creator"),
            namedNode(":"+user.name)
        ));
        store.addQuad(quad(
            namedNode(pdfResourcesUri),
            namedNode("rdf:type"),
            namedNode("bibo:Article")
        )); 
    }
    await createDatasetResource(project, prefix, user, store);
    await createAnnotationResource(project, prefix, pdfResourcesUri, annotations, store);
    await exportResources(project, prefix, pdfResourcesUri, projectResourcesUri, annotations, user, store);
    await createAuthorResource(user.name.replace(" ", ""), user.name, store);

    var output = "";

    
    const rdfTriples = store.getQuads(null, null, null);
    const writer = new N3.Writer({ prefixes: 
        {   //Prefixes goes here
            
            rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            "": project.prefix,
            bibo: 'http://purl.org/ontology/bibo/',
            dcterms: 'http://purl.org/dc/terms/',
            foaf: 'http://xmlns.com/foaf/0.1/',
            "nif-core": 'http://persistence.uni-leipzig.org/nlp2rdf/ontologies/nif-core#',
            owl: 'http://www.w3.org/2002/07/owl#',
            prov: 'http://www.w3.org/ns/prov#',
            rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
            skos: 'http://www.w3.org/2004/02/skos/core#',
            skosxl: 'http://www.w3.org/2008/05/skos-xl#',
            void: 'http://rdfs.org/ns/void#',
        }, 
    })
    rdfTriples.forEach(quad => {
        writer.addQuad(quad);
    })
    writer.end((error, result) => output = result);
    return Promise.resolve(output);
}

module.exports = {
    exportSerialization
}