﻿// 
// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
// 
#region Usings

using System;
using System.Collections.Generic;
using System.IO;
using System.Xml;

using DotNetNuke.Common.Utilities;
using DotNetNuke.Services.Installer.Packages;

#endregion

namespace DotNetNuke.Services.Installer.Writers
{
    /// -----------------------------------------------------------------------------
    /// <summary>
    /// The ScriptComponentWriter class handles creating the manifest for Script
    /// Component(s)
    /// </summary>
    /// <remarks>
    /// </remarks>
    /// -----------------------------------------------------------------------------
    public class ScriptComponentWriter : FileComponentWriter
    {
		#region "Constructors"

        public ScriptComponentWriter(string basePath, Dictionary<string, InstallFile> scripts, PackageInfo package) : base(basePath, scripts, package)
        {
        }
		
		#endregion

		#region "Public Properties"


        /// -----------------------------------------------------------------------------
        /// <summary>
        /// Gets the name of the Collection Node ("scripts")
        /// </summary>
        /// <value>A String</value>
        /// -----------------------------------------------------------------------------
        protected override string CollectionNodeName
        {
            get
            {
                return "scripts";
            }
        }

        /// -----------------------------------------------------------------------------
        /// <summary>
        /// Gets the name of the Component Type ("Script")
        /// </summary>
        /// <value>A String</value>
        /// -----------------------------------------------------------------------------
        protected override string ComponentType
        {
            get
            {
                return "Script";
            }
        }

        /// -----------------------------------------------------------------------------
        /// <summary>
        /// Gets the name of the Item Node ("script")
        /// </summary>
        /// <value>A String</value>
        /// -----------------------------------------------------------------------------
        protected override string ItemNodeName
        {
            get
            {
                return "script";
            }
        }

        protected override void WriteFileElement(XmlWriter writer, InstallFile file)
        {
            Log.AddInfo(string.Format(Util.WRITER_AddFileToManifest, file.Name));
            string type = "Install";
            string version = Null.NullString;
            string fileName = Path.GetFileNameWithoutExtension(file.Name);
            if (fileName.Equals("uninstall", StringComparison.InvariantCultureIgnoreCase)) //UnInstall.SqlDataprovider
            {
                type = "UnInstall";
                version = Package.Version.ToString(3);
            }
            else if (fileName.Equals("install", StringComparison.InvariantCultureIgnoreCase)) //Install.SqlDataprovider
            {
                type = "Install";
                version = new Version(0, 0, 0).ToString(3);
            }
            else if (fileName.StartsWith("Install")) //Install.xx.xx.xx.SqlDataprovider
            {
                type = "Install";
                version = fileName.Replace("Install.", "");
            }
            else //xx.xx.xx.SqlDataprovider
            {
                type = "Install";
                version = fileName;
            }
			
            //Start file Element
            writer.WriteStartElement(ItemNodeName);
            writer.WriteAttributeString("type", type);

            //Write path
            if (!string.IsNullOrEmpty(file.Path))
            {
                writer.WriteElementString("path", file.Path);
            }
			
            //Write name
            writer.WriteElementString("name", file.Name);

            //'Write sourceFileName
            if (!string.IsNullOrEmpty(file.SourceFileName))
            {
                writer.WriteElementString("sourceFileName", file.SourceFileName);
            }
			
            //Write Version
            writer.WriteElementString("version", version);

            //Close file Element
            writer.WriteEndElement();
        }
		
		#endregion
    }
}
