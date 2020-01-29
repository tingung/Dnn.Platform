﻿// 
// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
// 
using System;

namespace Dnn.PersonaBar.Pages.Components.Exceptions
{
    public class TemplateException : Exception
    {
        public TemplateException(string message): base(message)
        {
        }
    }
}