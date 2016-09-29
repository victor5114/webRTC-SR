import * as messageHandler from '../../app/server/messageHandler'

const WSMock = function () {
    this.send = function () {}
}

describe('signalingServer', function () {
    describe('Initialization', function () {
        it('onInit', function () {
            var ws = new WSMock()
            var message = {
                type: 'init',
                init: 1
            }

            messageHandler.default(message, ws)
            ws.id.should.be.equal(1)
            messageHandler.getConnectedPeers()[1].should.be.equal(ws)
        })
    })
    describe('Messages', function () {
        var spy, ws1, ws2

        beforeEach(function () {
            ws1 = new WSMock()
            ws1.id = 1
            ws2 = new WSMock()
            ws2.id = 2
            messageHandler.setConnectedPeer(1, ws1)
            messageHandler.setConnectedPeer(2, ws1)
            spy = sinon.spy(messageHandler.getConnectedPeers()[2], 'send')
        })

        afterEach(function () {
            spy.restore()
        })

        it('onOffer', function () {
            var offerSDP = 'offer SDP'
            var message = {
                type: 'offer',
                offer: offerSDP,
                destination: 2
            }
            messageHandler.default(message, ws1)
            spy.calledOnce.should.be.true

            var expectedResponse = '{"type":"offer","offer":"offer SDP","source":1}'
            spy.firstCall.args[0].should.eql(expectedResponse)
        })

        it('onAnswer', function () {
            var answerSDP = 'answer SDP'
            var message = {
                type: 'answer',
                answer: answerSDP,
                destination: 2
            }
            messageHandler.default(message, ws1)
            spy.calledOnce.should.be.true

            var expectedResponse = '{"type":"answer","answer":"answer SDP","source":1}'
            spy.firstCall.args[0].should.eql(expectedResponse)
        })

        it('onICECandidate', function () {
            var ICECandidateSDP = 'ICECandidate SDP'
            var message = {
                type: 'ICECandidate',
                ICECandidate: ICECandidateSDP,
                destination: 2
            }
            messageHandler.default(message, ws1)
            spy.calledOnce.should.be.true

            var expectedResponse = '{"type":"ICECandidate","ICECandidate":"ICECandidate SDP","source":1}'
            spy.firstCall.args[0].should.eql(expectedResponse)
        })
    })
})
