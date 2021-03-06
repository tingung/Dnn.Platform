﻿// 
// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
// 
#region Usings

using System;
using System.Web;
using DotNetNuke.Common;
using DotNetNuke.Entities.Portals;
using DotNetNuke.Entities.Users;
using DotNetNuke.Services.Personalization;

#endregion

namespace DotNetNuke.HttpModules.Personalization
{
    public class PersonalizationModule : IHttpModule
    {
        public string ModuleName
        {
            get
            {
                return "PersonalizationModule";
            }
        }

        #region IHttpModule Members

        public void Init(HttpApplication application)
        {
            application.EndRequest += OnEndRequest;
        }

        public void Dispose()
        {
        }

        #endregion

        public void OnEndRequest(object s, EventArgs e)
        {
            HttpContext context = ((HttpApplication) s).Context;
            HttpRequest request = context.Request;

            if (!Initialize.ProcessHttpModule(request, false, false))
            {
                return;
            }
			
            //Obtain PortalSettings from Current Context
            var _portalSettings = (PortalSettings)context.Items["PortalSettings"];
            if (_portalSettings != null)
            {
                //load the user info object
                UserInfo UserInfo = UserController.Instance.GetCurrentUserInfo();
                var personalization = new PersonalizationController();
                personalization.SaveProfile(context, UserInfo.UserID, _portalSettings.PortalId);
            }
        }
    }
}
