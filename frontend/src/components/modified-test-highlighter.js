const modifiedTestHighlights = {
    "https://arxiv.org/pdf/1708.08021.pdf": [
      {
        content: {
          text: "person"
        },
        position: {
          boundingRect: {
            x1: 255.73419189453125,
            y1: 139.140625,
            x2: 574.372314453125,
            y2: 165.140625,
            width: 809.9999999999999,
            height: 1200
          },
          rects: [
            {
              x1: 255.73419189453125,
              y1: 139.140625,
              x2: 574.372314453125,
              y2: 165.140625,
              width: 809.9999999999999,
              height: 1200
            }
          ],
          pageNumber: 1
        },
        resource: {
          resourceid: "123"
        },
        id: "8245652131754351"
      },
      {
        content: {
          text: "is an indivdual who attends classes"
        },
        position: {
          boundingRect: {
            x1: 353.080810546875,
            y1: 346.390625,
            x2: 658.6533203125,
            y2: 363.390625,
            width: 809.9999999999999,
            height: 1200
          },
          rects: [
            {
              x1: 353.080810546875,
              y1: 346.390625,
              x2: 658.6533203125,
              y2: 363.390625,
              width: 809.9999999999999,
              height: 1200
            }
          ],
          pageNumber: 1
        },
        resource: {
          type: "class",
          resourceName: "student",
          lang: "en",
          properties: {
              label: "",
              description: "is an indivdual who attends classes"          
            }
        },
        id: "812807243318874"
      },
      {
        content: {
          text:
            "studentid"
        },
        position: {
          boundingRect: {
            x1: 76.375,
            y1: 666.21875,
            x2: 733.61328125,
            y2: 706.140625,
            width: 809.9999999999999,
            height: 1200
          },
          rects: [
            {
              x1: 459.168701171875,
              y1: 666.21875,
              x2: 733.61328125,
              y2: 686.21875,
              width: 809.9999999999999,
              height: 1200
            },
            {
              x1: 76.375,
              y1: 686.140625,
              x2: 671.4954833984375,
              y2: 706.140625,
              width: 809.9999999999999,
              height: 1200
            }
          ],
          pageNumber: 1
        },
        resource: {
          type: "student",
          resourceName: "kwank2",
          lang: "en",
          properties: {
              label: "studentid",
              description: ""          
            }
        },
        id: "2599712881412761"
      },
      {
        content: {
         text: "senior at RPI majoring CS and ITWS"
        },
        position: {
          boundingRect: {
            x1: 410.8125,
            y1: 133,
            x2: 744.8125,
            y2: 261,
            width: 809.9999999999999,
            height: 1200
          },
          pageNumber: 3
        },
        resource: {
          type: "student",
          resourceName: "kwank2",
          lang: "en",
          properties: {
              label: "studentid",
              description: "senior at RPI majoring CS and ITWS"          
            }
        },
        id: "9120567402727258"
      },
    ]
  };
  

const resourceClasses = [
  {
    annotationid: "812807243318874",
    id: "123",
    name: "student",
    property: {
      label: "person",
      description: "someone who goes to school"
    }
  }
]

const resources = [
  {
    annotationid: "9120567402727258",
    id: "456",
    name: "kwank2",
    property: {
      label: "studentid",
      description: "senior at RPI majoring CS and ITWS"
    }
  }
]


  export default modifiedTestHighlights;