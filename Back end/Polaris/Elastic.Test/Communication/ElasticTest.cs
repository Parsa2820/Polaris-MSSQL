using Xunit;
using System.Collections.Generic;

using Elastic.Cumminucation;
using Elastic.Test.Importer;

namespace Elastic.Test.Communication
{
    public class ElasticTest
    {
        [Fact]
        public void InitClient()
        {
            ElasticClientFactory.CreateInitialClient("http://localhost:9200");
            var client = ElasticClientFactory.GetElasticClient();
            var response = client.Ping();
            Assert.True(response.IsValid);
        }

        public void ElasticImporterTest()
        {
            InitClient();
            var list = new List<CsvStringParserTest.Foo>();
            list.Add(new CsvStringParserTest.Foo(1, "John Dalton"));
            var importer = new ElasticImporter<CsvStringParserTest.Foo, int>();
            importer.BulkList(list, "xunit");
        }
    }
}