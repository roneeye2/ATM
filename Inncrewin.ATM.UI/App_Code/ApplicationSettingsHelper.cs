using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.IO;
using System.Xml.Serialization;
using System.Web.Optimization;
using System.Configuration;
using System.Web.UI;

/// <summary>
/// Class to handle Bundling and minification of Javascript and CSS files.
/// </summary>
public class ApplicationSettingsHelper
{
    /// <summary>
    /// This function will add the bundling and minification for the JS and CSS files. 
    /// File names and collection will be in the settings file on server.
    /// </summary>
    public void AddBundling()
    {
        string filePath = String.Empty;
        string bundleName = String.Empty;
        try
        {
            BundleTable.Bundles.UseCdn = true;
            StreamReader reader = new StreamReader(HttpContext.Current.Server.MapPath("~/Media/FileBundling.xml"));
            XmlSerializer serializer = new XmlSerializer(typeof(Bundling));

            Bundling bundlingInfo = (Bundling)serializer.Deserialize(reader);
            reader.Close();
            reader.Dispose();

            #region Bundling of the css files.
            Bundle cssBundle;
            
            foreach (Cascade css in bundlingInfo.Cascade)
            {
                cssBundle = new StyleBundle(css.Name);
                foreach (string cssFile in css.Path)
                {
                    cssBundle.Include(cssFile, new CssRewriteUrlTransform());
                }

                BundleTable.Bundles.Add(cssBundle);
            }

            #endregion

            #region Bundling of the java script files.

            Bundle jsBundle;
            foreach (JavaScript js in bundlingInfo.JavaScript)
            {
                bundleName = js.Name;
                jsBundle = new ScriptBundle(js.Name);
                foreach (string jsFile in js.Path)
                {
                    filePath = jsFile;
                    jsBundle.Include(jsFile);
                }

                BundleTable.Bundles.Add(jsBundle);
            }
            BundleTable.EnableOptimizations = true;
            #endregion
        }
        catch (Exception ex)
        {
            throw new Exception("There is a problem while creating Bundle", ex);
        }
    }

 
}