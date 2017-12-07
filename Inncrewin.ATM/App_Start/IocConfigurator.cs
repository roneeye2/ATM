namespace Inncrewin.ATM
{
    using Autofac;
    using Autofac.Integration.WebApi;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using System.Web;
    using System.Web.Http;

    public class IocConfigurator
    {
        public static IContainer Container;

        public static void Initialize(HttpConfiguration config)
        {
            Initialize(config, RegisterServices(new ContainerBuilder()));
        }


        public static void Initialize(HttpConfiguration config, IContainer container)
        {
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
        }

        private static IContainer RegisterServices(ContainerBuilder builder)
        {
            //Register your Web API controllers. 
            //todo : should go to xml for better extensablity. 
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly()).PropertiesAutowired();
            builder.RegisterType<Application.Withdraw>().As<Application.IWithdrow>().InstancePerRequest();
            builder.RegisterType<Application.BankNote.One>().As<Application.BankNote.IBankNote>().InstancePerRequest();
            builder.RegisterType<Application.BankNote.Two>().As<Application.BankNote.IBankNote>().InstancePerRequest();
            builder.RegisterType<Application.BankNote.Five>().As<Application.BankNote.IBankNote>().InstancePerRequest();
            builder.RegisterType<Application.BankNote.Ten>().As<Application.BankNote.IBankNote>().InstancePerRequest();
            builder.RegisterType<Application.BankNote.Twenty>().As<Application.BankNote.IBankNote>().InstancePerRequest();
            builder.RegisterType<Application.BankNote.Fifty>().As<Application.BankNote.IBankNote>().InstancePerRequest();
            builder.RegisterType<Application.BankNote.Hundred>().As<Application.BankNote.IBankNote>().InstancePerRequest();
            builder.RegisterType<Application.BankNote.FiveHundred>().As<Application.BankNote.IBankNote>().InstancePerRequest();
            builder.RegisterType<Application.BankNote.Thousands>().As<Application.BankNote.IBankNote>().InstancePerRequest();
            builder.RegisterType<Application.BankNote.TwoThousands>().As<Application.BankNote.IBankNote>().InstancePerRequest();

            //builder.RegisterGeneric(typeof(GenericRepository<>))
            //       .As(typeof(IGenericRepository<>))
            //       .InstancePerRequest();

            //Set the dependency resolver to be Autofac.  
            Container = builder.Build();

            return Container;
        }

    }
}