using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;

[Serializable]
public class JavaScript
{
    [XmlAttribute]
    public string Name { get; set; }

    [XmlElement]
    public string[] Path { get; set; }
}

public class Cascade
{
    [XmlAttribute]
    public string Name { get; set; }

    [XmlElement]
    public string[] Path { get; set; }
}

[Serializable]
public class Bundling
{
    [XmlElement]
    public JavaScript[] JavaScript { get; set; }

    [XmlElement]
    public Cascade[] Cascade { get; set; }
}