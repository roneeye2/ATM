namespace Inncrewin.ATM.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;

    public class WithdrowController : ApiController
    {
        private readonly Application.IWithdrow withdrow;

        public WithdrowController(Application.IWithdrow _withdrow)
        {
            withdrow = _withdrow;
        }

        // GET api/Withdrow/5
        public IEnumerable<KeyValuePair<Application.BankNote.IBankNote,int>> Get(int amount)
        {
            return withdrow.Distribute(amount); 
        }
    }
}
